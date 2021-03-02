import React, { Component } from "react";
import logo from './logo.svg';
import './App.css';
import './style.css';


class Quiz extends Component{
 constructor(props){
    super(props);

    this.state = {
      quiz_modes: ['Relax', 'Timed'], //todo: add descrip to display on menu infobox
      mode:0,
      ui:"menu", //menu, quiz or score
      player_name: "Anonymous",
      next: 0, //next question position
      picker: null,
      questions: null,
      question: null,
      score: 0,
      scores: null,
      answer: 0,
      total_questions: null,
      init: false,




    }

    //Option to load all questions on client to save request occurence. Optional feature... disabled.
    //this.generate_questions();



  }

  //picker randomize questions and make sure all questions are treated equal :D (equal display time for all)
  generate_picker(){
    //we can use this.state.questions.length-1 if total_questions is not available
    if(this.state.total_questions == null)
    return this.shuffle(this.create_fill_array(0, this.state.questions.length-1));

    //use stored state var total_questions
    return this.shuffle(this.create_fill_array(0, this.state.total_questions));

  }

  //load all the questions from json file from the backend.
  //Not used. ***************DISABLED********************
  generate_questions(){

    // const response = fetch("http://localhost:3002/menu");
    // const json = response.json();
    // this.setState({ questions: json });

    //get all available questions
    fetch("http://localhost:3002/questions")
      .then(res => res.json())
      .then(res => this.setState({questions : res}))
      .catch(err => err);

  }

  //load a question from the backend
  generate_question(){
    //clear question state var
    //this.setState({question: null});

    let picker= this.state.picker;
    let next= this.state.next;
    let id= picker[next];

    //you already know... get a question by id(position in the jason file is used instead of file id bc more reliable)
    fetch(`http://localhost:3002/question/${encodeURIComponent(id)}`)
      .then(res => res.json())
      .then(res => this.setState({question : res}))
      .catch(err => err);

  }

  //fill the state var(total_questions) that hold the total num of questions available
  //total_questions is used to create picker
  total_num_questions(){
    fetch(`http://localhost:3002/questions/all`)
      .then(res => res.json())
      .then(res => this.setState({total_questions : res}))
      .catch(err => err);

  }

  create_fill_array(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx);
  }

  show_menu(){

      //set Menu UI
      this.setState({ui:"menu"});

  }

  update_answer(answer_label){

    this.setState({answer: answer_label});
    //alert(this.state.answer);

  }


  //receive array of answers  backend
  check_answers(){
    //quiz continue if answer is correct. Quiz ends otherwise.

    let j=this.state.question.options.length;
    let k= this.state.answer;
    //alert(this.state.question.options[0].label);
    for(let i=0; i<j; i++){
      if(this.state.question.options[i].label == k && this.state.question.options[i].isCorrect)
        return true;
    }

    return false;

  }


  //function to randomize array of int
  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  //MENU UI
  toggle_mode(){

    let next_mode = this.state.mode +1;
    this.set_mode(next_mode);

  }

  set_mode(i){

    if(this.state.quiz_modes.length >= i)
      this.setState({mode:i});
    else
      this.setState({mode:i});

  }

  componentDidMount(){
    //load questions from api
    //this.setState({questions:this.generate_questions()});

  }

  start_quiz(){

    //next is the index for the picker array
    let next= this.state.next;
    //next in the picker array values
    let next_i= this.state.picker[next];
    //set the next question(semi backend single trip)
    //this.setState({question:this.state.questions[next_i]});

    //set the next question(full backend, 1 trip/question)
    this.generate_question(next_i);

    //changes the quiz ui
    this.setState({ui:"quiz"});
    // let next= this.state.next;
    // this.setState({question:this.state.questions[next]});

    //reset answer
    this.setState({answer : null});
    //reset score
    this.setState({score : 0});

    //prepare next question
    this.next_question();

  }

  refresh_quiz(){
    //next is the index for the picker array
    let next= this.state.next;
    //next in the picker array values
    let next_i= this.state.picker[next];

    //set the next question(semi backend)
    //this.setState({question:this.state.questions[next_i]});

    //set the next question(full backend)
    this.generate_question(next_i);

    //reset answer
    this.setState({answer : null});

    //prepare next question
    this.next_question();
  }

  //update the next random question's position
  next_question(){
    //next is the index for the picker array
    let next= this.state.next+1;

    if(next>=this.state.total_questions){
      //new arrangement of questions
      this.setState({picker: this.generate_picker()});
      //restart from beginning of new arrangement
      this.setState({next: 0});
    }
    else
      this.setState({next: next});
  }

  play(){
    if(this.state.answer==null){
      alert("Please select 1 answer.");
      return null;
    }


    if(this.check_answers()){
      alert("Good Answer!");
      //display next_question
      this.refresh_quiz();

      this.update_score(100);

    }
    else{
      alert("Wrong answer :(");

      this.end_quiz();

    }
  }

  update_score(points){
    let old_score= this.state.score;
    let new_score= old_score+points;

    this.setState({score: new_score});

  }

  //receive the player score to be saved and display scores list
  end_quiz(score){
    //save score
    //this.save_score();
    //Set back question to null
    this.setState({question:null}); //to be removed
    //changes the quiz status
    this.setState({ui:"score"});

  }

  save_score(){

    let score=this.state.score;
    let name= this.state.player_name;

    //api save and returns new updated list of scores
    fetch(`http://localhost:3002/save/score/${encodeURIComponent(score)}/${encodeURIComponent(name)}`)
      .then(res => res.json())
      .then(res => this.setState({question : res}))
      .catch(err => err);

  }

  render(){
    if (this.state.init === null) {
      // Render loading state ...


      return null;
    }
    else {
      // Render real UI ...

    //create question picker after state.questions is defined
    if(this.state.picker === null){
      //set the total number of questions needed to create a picker
      if(this.state.total_questions == null)
      this.total_num_questions();
      else
      this.setState({picker:this.generate_picker()});

      //Do nothing until picker is created
      return null;

    }
    //alert(this.state.total_questions);
    if(this.state.ui=="menu"){
      return (
        // <div>
        //   <h1>Quiz for !Dummies</h1>
        //
        //   <div>
        //     <h2>Menu</h2>
        //     <h3>About</h3>
        //     <p>This quiz is NOT for Dummies. Quiz ends when wrong answered. Relax mode gives 100 point per good answer, Timed mode 200 points for good answers
        //     -100 points for bad answers. Enter your name and start competing! Beat world records and enter the Hall of Fame!</p>
        //     <h3>Choose quiz mode</h3>
        //     <li key="1155544" onClick={()=> this.set_mode(0)}>Relaxed</li>
        //     <li key="569999" onClick={()=> this.set_mode(1)}>Timed</li>
        //
        //     <button onClick={()=> this.start_quiz()}>start_quiz</button>
        //   </div>
        // </div>


        <div id='main'>
          <h1 id="brand">Quiz for !Dummies</h1>
          <h2 className="score">Menu</h2>
          <h3>About</h3>
          <p>
            This quiz is NOT for Dummies. Quiz ends when wrong answered. Relax mode gives 100 point per good answer,
             Timed mode 200 points for good answers -100 points for bad answers. Enter your name and start competing!
             Beat world records and enter the Hall of Fame!
           </p>
          <h3>Select quiz Mode</h3>
          <p>Selected Mode: {this.state.quiz_modes[this.state.mode]}</p>
          <ul>
             
            <li className='option'  key="1155544"><span className='label'>1 :</span><span className='answer'>Relaxed</span></li>
            <li className='option' key="569999"><span className='label'>2 :</span><span className='answer'>Timed</span></li>
          </ul>

          <div className="container"><button type="button" name="button" className="validate" onClick={()=> this.start_quiz()}>Start Quiz</button></div>
        </div>
      );
    }
    else if(this.state.ui=="quiz"){
      //alert(this.state.question);
      if(this.state.question === null)
        return null;
      else{
        return (

          // <div>
          //   <h1>Quiz for !Dummies</h1>
          //   <p>Selected answer: {this.state.answer}</p>
          //   <h3>{this.state.question.question}</h3>
          //   {this.state.question.options.map(answer => (
          //     <li onClick={()=> this.update_answer(answer.label)}>{answer.label}: {answer.value}</li>
          //   ))}
          //   <p>Score:{this.state.picker}</p>
          //   <p>Score:{this.state.score}</p>
          //   <p>Mode:{this.state.quiz_modes[this.state.mode]}</p>
          //   <button onClick={()=> this.play()}>Validate my answer</button>
          // </div>

          <div id="main">
            <h1 id="brand">Quiz for !Dummies</h1>
            <h2 className="score">Score: {this.state.score}<span className="time">Time-left: 00</span></h2>
            <h3>Question</h3>
            <h4 className="question">{this.state.question.question}</h4>
            <p>Selected Answer: {this.state.answer}</p>
            <ul>

              {this.state.question.options.map(answer => (
                <li className='option' onClick={()=> this.update_answer(answer.label)}><span className='label'>{answer.label} :</span><span className='answer'>{answer.value}</span></li>
              ))}

            </ul>

            <div className="container"><button type="button" name="button" className="validate" onClick={()=> this.play()}>Validate my Answer</button></div>

            <p>Mode: {this.state.quiz_modes[this.state.mode]}</p>
          </div>
        );
      }
    }
    else if(this.state.ui=="score"){
      return (
        // <div>
        //   <h1>Quiz for !Dummies</h1>
        //
        //   <h3>Your score is {this.state.score}</h3>
        //
        //   <p>Thank you for playing! </p>
        //
        //   <button onClick={()=> this.show_menu()}>Retake the Quiz</button>
        // </div>


        <div id='main'>
          <h1 id="brand">Quiz for !Dummies</h1>
          <h2 className="score">Your score is {this.state.score}! Thank you for playing!</h2>
          <h3>Hall of Fame</h3>
          <table>
            <tr>
            <th>Score</th>
            <th>Player</th>
            <th>Date</th>
            <th>Mode</th>
            </tr>
            <tr>
              <td>100</td>
              <td>Smith</td>
              <td>data</td>
              <td>Relaxed</td>
            </tr>
            <tr>
              <td>600</td>
              <td>Jackson</td>
              <td>94</td>
              <td>Relaxed</td>
            </tr>
          </table>

          <div className="container"><button type="button" name="button" className="validate" onClick={()=> this.show_menu()}>Retake the quiz</button></div>


        </div>
      );
    }
  }

}

}


export default Quiz;
