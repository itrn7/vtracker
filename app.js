/* 
Stuff to add:
    -interface for player to modify values of numr, numi, maxspeed, sizeupperbound, sizelowerbound, default_sizeV, acceleration_negative_constant, stoptime_s
    -
    
*/

//variables
let running = 0
const scoredisplay = document.querySelector('#scoredisplay')
let score = 0
//scoredisplay.innerHTML = scoredisplay.innerHTML + 0.0001
const rpoints = []
const ipoints = []
const player = document.querySelector('#player')
const player_position = [0, 0]
const grid = document.querySelector('#rgrid')

let numr = 2 //number of reference points
let numi = 0 //number of ignored points
const center = [250, 250]
const maxspeed = 2.65
let timerID
//const acceleration = 2
const p1 = document.querySelector('#p1')
const p1_position = [0, 0]
const maxscoredisplay = document.querySelector("#maxscore")
let maxscore = 0
let answervisibility = 'visible'
let sizeupperbound = 30
let sizelowerbound = 10
let default_sizeV = 0.02
let acceleration_negative_constant = -0.01
let stoptime_s = 60
let gametimer
let starttime_s = 0
const time = document.querySelector("#timedisplay")
let ipointcolor = "yes"


//settings:
const ui_numr = document.querySelector("#ui_numr")
const ui_numi = document.querySelector("#ui_numi")
const ui_ipointcolor = document.querySelector("#ipointcolor")

//classes
class point {
    constructor() {
        //random position(centered)
        console.log("new point created")
        this.size = 10
        this.x = (Math.random() - 0.5) * 800
        this.y = (Math.random() - 0.5) * 800
        //random initial velocity
        this.xV = (Math.random() - 0.5) * 1 * 2
        this.yV = (Math.random() - 0.5) * 1 * 2
        //visual element
        this.visual = document.createElement('div')
        this.visual.classList.add('point')
        grid.appendChild(this.visual)
        //visual element initial position
        this.visual.style.left = this.x + 400 - this.size/2 + 'px'
        this.visual.style.bottom = this.y + 400 - this.size/2 + 'px'
        //acceleration vector as a function of position in page
        this.xA = 0
        this.yA = 0
        
        this.sizeV = (Math.random()-0.5) * default_sizeV
    }
}

//updating settings
//ui_numr.addEventListener('input', update_settings)
//ui_numi.addEventListener('input', update_settings)


//run
document.addEventListener('keydown', start)
document.addEventListener('mousemove', p1followcursor)
scoredisplay.innerHTML = "SCORE: " + score
maxscoredisplay.innerHTML = "Max Score: " + maxscore
document.addEventListener('keydown', answer_switch_vis)
player.style.visibility = answervisibility


//p1 follows cursor
function p1followcursor(e) {
    //console.log("follow")
    p1_position[0] = e.pageX - 115 - 400
    p1_position[1] = -e.pageY + 865 - 400
    p1.style.left = p1_position[0] + 400 + 'px'
    p1.style.bottom = p1_position[1] + 400 + 'px'
}

//answer visibility control
function answer_switch_vis(e) {
    //console.log(answervisibility)
    if (e.keyCode === 86) {
        if (answervisibility == 'hidden') {
            answervisibility = 'visible'
            console.log(answervisibility)
            player.style.visibility = answervisibility
            return
        }
        if (answervisibility == 'visible') {
            answervisibility = 'hidden'
            console.log(answervisibility)
            player.style.visibility = answervisibility
            return
        }
        
    }
}

//start dynamics function or reload page
function start(e) {
    if (e.key == " ") {
        if (running == 0) {
            timerID = setInterval(process, 20)
            gametimer = setInterval(time_elapsed, 1000)
            running = 1
        }
        if (ipointcolor == "no") {
            for (let i = 0; i < numi; i++) {
                ipoints[i].visual.style.backgroundColor = "blue"
            }
        }
        return
    }
    if (e.key == "r") {
        location.reload()
        return
    }
    if (e.key == "p") {
        clearInterval(timerID)
        clearInterval(gametimer)
        return
    }
    if (e.keyCode == 13) {
        update_settings() 
        create_points()
        update_player_position()
        starttime_s = 0
        time.innerHTML = "Time: " + starttime_s + 's'
        score = 0
        maxscore = 0
        scoredisplay.innerHTML = "SCORE: " + score
        maxscoredisplay.innerHTML = "Max Score: " + maxscore
        running = 0
        clearInterval(timerID)
        clearInterval(gametimer)
        return
    }
}

function time_elapsed() {
    starttime_s += 1
    time.innerHTML = "Time: " + starttime_s + 's'
    if (starttime_s == stoptime_s) {
        clearInterval(timerID)
        clearInterval(gametimer)
    }
}

function update_settings(e) {
    clearpoints() 

    numr = parseInt(ui_numr.value)
    numi = parseInt(ui_numi.value)
    ipointcolor = (ui_ipointcolor.value)
}

function clearpoints() {
    for (let i = 0; i < rpoints.length; i++) {
        grid.removeChild(rpoints[i].visual)
    }
    for (let i = 0; i < ipoints.length; i++) {
        grid.removeChild(ipoints[i].visual)
    }
    rpoints.length = 0
    ipoints.length = 0
}

//interval-process
function process() {
    //points
    
    for (let i = 0; i < numr; i++) {
        //update visual position using object position (& offset)
        rpoints[i].visual.style.left = rpoints[i].x + 400 - rpoints[i].size/2 + 'px' 
        rpoints[i].visual.style.bottom = rpoints[i].y + 400 - rpoints[i].size/2 + 'px'
        rpoints[i].visual.style.height = rpoints[i].size + 'px'
        rpoints[i].visual.style.width = rpoints[i].size + 'px'
        rpoints[i].visual.style.borderRadius = rpoints[i].size + 'px'
        //update object position using velocity info
        rpoints[i].x += rpoints[i].xV
        rpoints[i].y += rpoints[i].yV
        //update object velocity using acceleration info
        rpoints[i].xV += rpoints[i].xA
        rpoints[i].yV += rpoints[i].yA
        //normalize speed to maxspeed if it exceeds it
        if (Math.sqrt((rpoints[i].xV**2)+(rpoints[i].yV**2)) > maxspeed) 
            {rpoints[i].xV = normalize(rpoints[i].xV, rpoints[i].yV)[0], rpoints[i].yV = normalize(rpoints[i].xV, rpoints[i].yV)[1]}
        //update acceleration using position info relative to graph
        rpoints[i].xA = normalize(rpoints[i].x + (Math.random() - 0.5)*80, rpoints[i].y + (Math.random() - 0.5)*80)[0] * acceleration_negative_constant
        rpoints[i].yA = normalize(rpoints[i].x + (Math.random() - 0.5)*80, rpoints[i].y + (Math.random() - 0.5)*80)[1] * acceleration_negative_constant
        //update size of point randomly
        rpoints[i].size += rpoints[i].sizeV
        if (rpoints[i].size < sizelowerbound) {rpoints[i].sizeV += 0.02}
        if (rpoints[i].size > sizeupperbound) {rpoints[i].sizeV -= 0.02}
        rpoints[i].sizeV += (Math.random()-0.5) * 0.005
        
    }
    for (let i = 0; i < numi; i++) {
        ipoints[i].visual.style.left = ipoints[i].x + 400 + 'px'
        ipoints[i].visual.style.bottom = ipoints[i].y + 400 + 'px'
        ipoints[i].visual.style.height = ipoints[i].size + 'px'
        ipoints[i].visual.style.width = ipoints[i].size + 'px'
        ipoints[i].visual.style.borderRadius = ipoints[i].size + 'px'

        ipoints[i].x += ipoints[i].xV
        ipoints[i].y += ipoints[i].yV

        ipoints[i].xV += ipoints[i].xA
        ipoints[i].yV += ipoints[i].yA
        if (Math.sqrt((ipoints[i].xV**2)+(ipoints[i].yV**2)) > maxspeed) 
            {ipoints[i].xV = normalize(ipoints[i].xV, ipoints[i].yV)[0], ipoints[i].yV = normalize(ipoints[i].xV, ipoints[i].yV)[1]}

        ipoints[i].xA = normalize(ipoints[i].x + (Math.random() - 0.5)*80, ipoints[i].y + (Math.random() - 0.5)*80)[0] * acceleration_negative_constant
        ipoints[i].yA = normalize(ipoints[i].x + (Math.random() - 0.5)*80, ipoints[i].y+ (Math.random() - 0.5)*80)[1] * acceleration_negative_constant

        ipoints[i].size += ipoints[i].sizeV
        if (ipoints[i].size < sizelowerbound) {ipoints[i].sizeV += 0.02}
        if (ipoints[i].size > sizeupperbound) {ipoints[i].sizeV -= 0.02}
        ipoints[i].sizeV += (Math.random()-0.5) * 0.005
    }

    //player answer key
    update_player_position()

    //calculate score based on relation between answer key and player(starts when process function starts)
    score_calculation()
}

function score_calculation() {
    //console.log(p1_position[0], p1_position[1])
    //max distance at which score increases per 20ms: 30px
    let l = Math.sqrt(((p1_position[0]-player_position[0])**2) + ((p1_position[1]-player_position[1])**2))
    if (1 - (l)/30 + 0.1 >= 0) {
        score += 1 - (l)/30 + 0.1
    }
    maxscore += 1
    scoredisplay.innerHTML = "SCORE: " + score
    maxscoredisplay.innerHTML = "Max Score: " + maxscore
}

//position average integration, as a function of size & position of each reference point
function update_player_position() {
    
    player_position[0] = 0
    player_position[1] = 0
    let totalsizevalue = 0
    for (let i = 0; i < numr; i++) {
        totalsizevalue += rpoints[i].size
    }
    for (let i = 0; i < numr; i++) {
        player_position[0] += (rpoints[i].x) * rpoints[i].size/(totalsizevalue/numr) 
        player_position[1] += (rpoints[i].y) * rpoints[i].size/(totalsizevalue/numr) 
    }
    player_position[0] /= numr
    player_position[1] /= numr
    //finish integration

    //update visual element
    player.style.left = player_position[0] - 10 + 400 + 'px'
    player.style.bottom = player_position[1] - 10 + 400 + 'px'
}

//normalize a 2D vector
function normalize(x, y) {
    let l = Math.sqrt((x**2) + (y**2))
    return [x/l, y/l]
}

//create points
function create_points() {
    for (let i = 0; i < numr; i++) { //reference points
        rpoints.push(new point())
    }
    for (let i = 0; i < numi; i++) { //ignored points
        ipoints.push(new point())
        ipoints[i].visual.style.backgroundColor = "red"
    }
}