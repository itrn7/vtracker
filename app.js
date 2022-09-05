/* Plan: 
    scoring
    1 grid
    generation of points
    integrating functions
    reference points velocity: constant? range? completely random? option for all 3?
    -mouse-to-player point sensitivity/responsiveness
    idea: make sizes of reference points vary over time -> the bigger ones have larger influence on answer position
    -create separate player(answer) and cursor(actual player) objects.
    perhaps the player can see which points are to be ignored but only before starting
    minimum setInterval: 10ms
*/

//variables
const scoredisplay = document.querySelector('#scoredisplay')
let score = 0
//scoredisplay.innerHTML = scoredisplay.innerHTML + 0.0001
const rpoints = []
const ipoints = []
const player = document.querySelector('#player')
const player_position = [0, 0]
const grid = document.querySelector('#rgrid')

const numr = 2
const numi = 0
const center = [250, 250]
const maxspeed = 2.5
let timerID
//const acceleration = 2
const p1 = document.querySelector('#p1')
const p1_position = [0, 0]
const maxscoredisplay = document.querySelector("#maxscore")
let maxscore = 0
let answervisibility = 'visible'

//classes
class point {
    constructor() {
        //random position(centered)
        console.log("new point created")
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
        this.visual.style.left = this.x + 400 + 'px'
        this.visual.style.bottom = this.y + 400 + 'px'
        //acceleration vector as a function of position in page
        this.xA = 0
        this.yA = 0
        this.size = 10
        this.sizeV = (Math.random()-0.5) * 0.02
    }
}

//run
create_points()
document.addEventListener('keydown', start)
update_player_position()
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
        timerID = setInterval(process, 20)
        //for (let i = 0; i < numi; i++) {
        //    ipoints[i].visual.style.backgroundColor = "blue"
        //}
    }
    if (e.keyCode == 13) {
        location.reload()
    }
}

//interval-process
function process() {
    //points
    
    for (let i = 0; i < numr; i++) {
        //update visual position using object position (& offset)
        rpoints[i].visual.style.left = rpoints[i].x + 400 + 'px'
        rpoints[i].visual.style.bottom = rpoints[i].y + 400 + 'px'
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
        rpoints[i].xA = normalize(rpoints[i].x + (Math.random() - 0.5)*80, rpoints[i].y + (Math.random() - 0.5)*70)[0] * -0.011
        rpoints[i].yA = normalize(rpoints[i].x + (Math.random() - 0.5)*80, rpoints[i].y + (Math.random() - 0.5)*70)[1] * -0.011
        //update size of point randomly
        rpoints[i].size += rpoints[i].sizeV
        if (rpoints[i].size < 10) {rpoints[i].sizeV += 0.02}
        if (rpoints[i].size > 30) {rpoints[i].sizeV -= 0.02}
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
        if (Math.sqrt((rpoints[i].xV**2)+(rpoints[i].yV**2)) > maxspeed) 
            {rpoints[i].xV = normalize(rpoints[i].xV, rpoints[i].yV)[0], rpoints[i].yV = normalize(rpoints[i].xV, rpoints[i].yV)[1]}

        ipoints[i].xA = normalize(ipoints[i].x + (Math.random() - 0.5)*70, ipoints[i].y + (Math.random() - 0.5)*70)[0] * -0.011
        ipoints[i].yA = normalize(ipoints[i].x + (Math.random() - 0.5)*70, ipoints[i].y+ (Math.random() - 0.5)*70)[1] * -0.011

        ipoints[i].size += ipoints[i].sizeV
        if (ipoints[i].size < 10) {ipoints[i].sizeV += 0.02}
        if (ipoints[i].size > 30) {ipoints[i].sizeV -= 0.02}
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
        player_position[0] += rpoints[i].x * rpoints[i].size/(totalsizevalue/numr)
        player_position[1] += rpoints[i].y * rpoints[i].size/(totalsizevalue/numr)
    }
    player_position[0] /= numr
    player_position[1] /= numr
    //finish integration

    //update visual element
    player.style.left = player_position[0] + 7 + 400 + 'px'
    player.style.bottom = player_position[1] + 7 + 400 + 'px'
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