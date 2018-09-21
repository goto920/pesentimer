import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import packageJSON from '../package.json'
import WAAClock from 'waaclock'
import BufferLoader from './buffer-loader'
import cowbell_mid from './cowbell_mid.mp3'
import cowbell_high from './cowbell_high.mp3'
import rideCup from './rideCup.mp3'
import church from './church.mp3'
import hotel from './hotel.mp3'
import more01 from './01more.mp3'
import more02 from './02more.mp3'
import more03 from './03more.mp3'
import more04 from './04more.mp3'
import more05 from './05more.mp3'
import more10 from './10more.mp3'
import more15 from './15more.mp3'
import more20 from './20more.mp3'
import endTalk from './endTalk.mp3'
import endSession from './endSession.mp3'

// global variable
window.AudioContext = window.AudioContext || window.webkitAudioContext
var context 
// = new window.AudioContext()
var clock 
// = undefined

const version = (packageJSON.homepage + packageJSON.subversion).slice(-10)
const homepage = 'https://goto920.github.io/presentationTimer.html'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      timerState: 'initial', // 'initial', 'running', 'paused'
      timerString: '00:00',
      timerStyle: {color: 'black'}
    }

    this.params = {
      presentationTime: 5, // default min
      warningTime: 1, // default 1 min before end of talk
      warningSound: null, // default 1 min before end of talk
      qAndATime: 3, // default min
      beginTime: 0, // in sec
      pausedAt: 0, // in sec
      sound: 'voice' // 'bell', 'voice', 'mute'
    }
 
    this.handleUI = this.handleUI.bind(this) 
    this.handleWindowClose = this.handleWindowClose.bind(this)
    this.processTimer = this.processTimer.bind(this)
    this.playSound = this.playSound.bind(this)

    this.state.timerString = ('00' + this.params.presentationTime).slice(-2)
       + ':00' 
    this.timerEvent = undefined
    this.soundList = []
  }

 // componentWillMount () { // before render()
 // }

  componentDidMount () {
    window.addEventListener('beforeunload', this.handleWindowClose)
    context = new window.AudioContext()
    clock = new WAAClock(context)
    clock.start()

    let inputFiles = []
    inputFiles[0] = cowbell_mid 
    inputFiles[1] = cowbell_high
    inputFiles[2] = rideCup
    inputFiles[3] = church
    inputFiles[4] = hotel
    inputFiles[5] = more01 
    inputFiles[6] = more02
    inputFiles[7] = more03 
    inputFiles[8] = more04 
    inputFiles[9] = more05
    inputFiles[10] = more10 
    inputFiles[11] = more15 
    inputFiles[12] = more20
    inputFiles[13] = endTalk
    inputFiles[14] = endSession

    let bufferLoader = new BufferLoader(
      context, inputFiles, function(bufferList) {
       for (let i=0; i < inputFiles.length; i++)
       this.soundList[i] = bufferList[i] 
     }.bind(this)
    )
    bufferLoader.load()

  }

  componentWillUnMount () {
    window.removeEventListener('beforeunload', this.handleWindowClose)
  }
 
  render() {

    const color = {color: this.state.timerStyle.color}
    const timerString = this.state.timerString
    let startButtonStr

    if (this.state.timerState === 'initial') 
      startButtonStr = 'Start'
    else if (this.state.timerState === 'paused') 
      startButtonStr = 'Cont.'
    else if (this.state.timerState === 'running') 
      startButtonStr = 'Pause'
    else console.log('timerState error')

    return (
      <div className='presentimer'>
      <h3>Presentation Timer</h3>
      <hr/>
      {/* <SetTimerColor /> */}
      <div className='timebox' style={color}>{timerString}</div>
      <hr/>
      <span className='redbutton'>
      <button name='startStop' onClick={this.handleUI}>{startButtonStr}</button>
      </span>
      &nbsp; &nbsp;
      <span className='redbutton'>
      <button name='reset' onClick={this.handleUI}>Reset</button></span>
      <hr/>
      <span className='selector'>
      Presentation talk(min): &nbsp; 
      <select name='presenTime' 
         defaultValue={this.params.presentationTime} onChange={this.handleUI}>
      <option value='1'>1</option>
      <option value='2'>2</option>
      <option value='3'>3</option>
      <option value='4'>4</option>
      <option value='5'>5</option>
      <option value='6'>6</option>
      <option value='7'>7</option>
      <option value='8'>8</option>
      <option value='9'>9</option>
      <option value='10'>10</option>
      <option value='15'>15</option>
      <option value='20'>20</option>
      <option value='25'>35</option>
      <option value='30'>30</option>
      <option value='40'>40</option>
      <option value='45'>45</option>
      <option value='50'>50</option>
      <option value='55'>55</option>
      <option value='60'>60</option>
      <option value='70'>70</option>
      <option value='80'>80</option>
      <option value='90'>90</option>
      </select>
      <br/>
      Warning: &nbsp;
      <select name='warningTime' 
         defaultValue={this.params.warningTime} onChange={this.handleUI}>
      <option value='0'>none</option>
      <option value='1'>1</option>
      <option value='2'>2</option>
      <option value='3'>3</option>
      <option value='4'>4</option>
      <option value='5'>5</option>
      <option value='10'>10</option>
      <option value='15'>15</option>
      <option value='20'>20</option>
      </select> 
      &nbsp; minute(s) more
      <br/>
      Q and A (min): &nbsp;
      <select name='qAndATime' defaultValue={this.params.qAndATime} 
        onChange={this.handleUI}>
      <option value='1'>1</option>
      <option value='2'>2</option>
      <option value='3'>3</option>
      <option value='4'>4</option>
      <option value='5'>5</option>
      <option value='6'>6</option>
      <option value='7'>7</option>
      <option value='8'>8</option>
      <option value='9'>9</option>
      <option value='10'>10</option>
      <option value='15'>15</option>
      <option value='20'>20</option>
      </select>
      </span>
      <br/>
      Sound alarm: <br/> 
       <span className='radioButton'>
       <input type='radio' name='alarmSound' value='cowbell_mid' 
           onChange={this.handleUI}/>Cowbell_mid, 
       <input type='radio' name='alarmSound' value='cowbell_high' 
           onChange={this.handleUI}/>Cowbell_high, 
       <input type='radio' name='alarmSound' value='rideCup' 
           onChange={this.handleUI}/>RideCup, <br/>
       <input type='radio' name='alarmSound' value='church' 
           onChange={this.handleUI}/>Church, 
       <input type='radio' name='alarmSound' value='hotel' 
           defaultChecked='true' onChange={this.handleUI}/>Hotel, 
       <input type='radio' name='alarmSound' value='voice' 
           onChange={this.handleUI}/>Voice,
       <input type='radio' name='alarmSound' value='mute' 
           onChange={this.handleUI}/>Mute
       </span>
      <br/>
      <hr/>
      Version: {version}, <a href={homepage} target='_blank'>Manual/Update</a>
      </div>
    );
  }

  handleUI (event) {
    if (event.target.name === 'startStop'){

      if (this.state.timerState === 'running'){ // stop
        this.params.pausedAt = context.currentTime - this.params.beginTime
        this.timerEvent.clear()
        this.setState({timerState: 'paused'})
      } else if (this.state.timerState === 'initial') { // start

        this.params.beginTime = context.currentTime
        this.timerEvent = clock.callbackAtTime(function (event) {
        this.processTimer()
         }.bind(this), context.currentTime)
        .repeat(1.0)
        .tolerance({early: 0.1, late: 1})
        this.setState({timerState: 'running'})
      } else if (this.state.timerState === 'paused') { // continue
        this.params.beginTime = context.currentTime 
             - this.params.pausedAt 
        this.timerEvent = clock.callbackAtTime(function (event) {
        this.processTimer()
         }.bind(this), context.currentTime + (this.params.pausedAt % 1))
        .repeat(1.0)
        .tolerance({early: 0.1, late: 0.1})
        this.setState({timerState: 'running'})
      }

      return
    }

    if (event.target.name === 'reset'){
      if (this.timerEvent !== undefined) this.timerEvent.clear()
      let timerStr = this.params.presentationTime + ':00' 
      this.setState({timerState: 'initial', timerString: timerStr,
         timerStyle: {color: 'black'}})
      return
    }

    if (event.target.name === 'presenTime'){
      this.params.presentationTime = parseInt(event.target.value,10)
      let timerStr = this.params.presentationTime + ':00' 
      this.setState({timerString: timerStr})
      return
    }

    if (event.target.name === 'warningTime'){
      this.params.warningTime = parseInt(event.target.value,10)
      if (this.params.warningTime >= this.params.presentationTime)
         this.params.warningTime = 0 // none


    }

    if (event.target.name === 'qAndATime'){
      this.params.qAndATime = parseInt(event.target.value,10)
      return
    }

    if (event.target.name === 'alarmSound'){
      this.params.sound = event.target.value
      // console.log(this.params.sound)
      return
    }

  }

  handleWindowClose (event) { // finishing clean up
    clock.stop()
    context.close()
  }

  processTimer(){
    let currentSec = context.currentTime - this.params.beginTime
    let timerStr
    let over
    let color

    if (currentSec 
       < (this.params.presentationTime - this.params.warningTime)*60){
      let left = this.params.presentationTime*60 - currentSec
      timerStr = ('00' + parseInt(left/60,10)).slice(-2) 
           + ':' + ('00' + parseInt(left % 60,10)).slice(-2) 
      color = 'blue'
    } else if (currentSec < this.params.presentationTime*60){
      let left = this.params.presentationTime*60 - currentSec
      timerStr = ('00' + parseInt(left/60,10)).slice(-2) 
          + ':' + ('00' + parseInt(left % 60,10)).slice(-2) 
      color = 'orange'
    } else if (currentSec 
        <= (this.params.presentationTime
          + this.params.qAndATime)*60 ){
      over = currentSec - this.params.presentationTime*60 
      timerStr = ('+' + parseInt(over/60,10))
           + ':' + ('00' + parseInt(over % 60,10)).slice(-2) 
      color = 'green'
    } else {
      // console.log('End Q and A Time')
      over = currentSec - parseInt(this.params.presentationTime,10)*60 
      timerStr = ('++' + parseInt(over/60,10))
           + ':' + ('00' + parseInt(over % 60,10)).slice(-2) 
      color = 'red'
    }

    if (color === this.state.timerStyle.color){
      this.setState({timerString: timerStr})
    } else {
      this.setState({timerString: timerStr, timerStyle: {color: color}})

      if (this.params.sound !== 'mute'){
        if (color === 'orange') this.playSound(1)
        else if (color === 'green')  this.playSound(2)
        else if (color === 'red')  this.playSound(3)
      }
    }
  } // end of processTimer()

  playSound(phase){
    let source
    // console.log(phase)
    let sound
    if (this.params.sound === 'cowbell_mid') 
        sound = this.soundList[0] 
    else if (this.params.sound === 'cowbell_high') 
        sound = this.soundList[1] 
    else if (this.params.sound === 'rideCup') 
        sound = this.soundList[2] 
    else if (this.params.sound === 'church') 
        sound = this.soundList[3] 
    else if (this.params.sound === 'hotel') 
        sound = this.soundList[4] 

    if (this.params.warningTime === 0)
      this.params.warningSound = null
    else if (this.params.warningTime === 1)
      this.params.warningSound = this.soundList[5]
    else if (this.params.warningTime === 2)
      this.params.warningSound = this.soundList[6]
    else if (this.params.warningTime === 3)
      this.params.warningSound = this.soundList[7]
    else if (this.params.warningTime === 4)
      this.params.warningSound = this.soundList[8]
    else if (this.params.warningTime === 5)
      this.params.warningSound = this.soundList[9]
    else if (this.params.warningTime === 10)
      this.params.warningSound = this.soundList[10]
    else if (this.params.warningTime === 15)
      this.params.warningSound = this.soundList[11]
    else if (this.params.warningTime === 20)
      this.params.warningSound = this.soundList[12]

    if (phase === 1){
      if (this.params.sound === 'voice'){
        source = context.createBufferSource()
        source.buffer = this.params.warningSound // X more minutes
        source.connect(context.destination)
        source.start(context.currentTime)
      } else {
        source = context.createBufferSource()
        source.buffer = sound
        source.connect(context.destination)
        source.start(context.currentTime)
      }
      return
    } 

    if (phase === 2){

     if (this.params.sound === 'voice'){
        source = context.createBufferSource()
        source.buffer = this.soundList[13] // End of Talk
        source.connect(context.destination)
        source.start(context.currentTime)
     } else {
        for (let i = 0; i < phase; i++){
          source = context.createBufferSource()
          source.buffer = sound // bell
          source.connect(context.destination)
          source.start(context.currentTime + i*1.5)
        }
     }
     return
   }

   if (phase === 3){
      // console.log(this.params.sound)
     if (this.params.sound === 'voice') {
       source = context.createBufferSource()
       source.buffer = this.soundList[14] // End of Session
       source.connect(context.destination)
       source.start(context.currentTime)
     } else {
        for (let i = 0; i < phase; i++){
          source = context.createBufferSource()
          source.buffer = sound
          source.connect(context.destination)
          source.start(context.currentTime + i*1.5)
        }
     }
    return
   } // end phase 2

   return
   
  } // end of playSound()

}

export default App;
