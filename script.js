gsap.config({trialWarn: false});
console.clear()
let select = s => document.querySelector(s),
		canvas = select('#canvas'),
		ctx = canvas.getContext('2d'),
		particles = [],
		sizeObj = {width: window.innerWidth,
							 height: window.innerHeight
							},
		particleArray = [],
		bigCircleArray = [],
		smallCircleArray = [],
		colorArray = ["fec10e","fe744d","cc9edc","ff4b10","019bd9","a1e8af","979797","83c9f4","5c374c","302f4d"],
		mousePos = {
			x: sizeObj.width/2,
			y: sizeObj.height/2
		},
		particleArea = Math.min(sizeObj.width, sizeObj.height) * 0.2,
		numParticles = 66,
		step = 360/numParticles,
		clickCount = -1,
		oldColor = null,
		currentColor = null

colorArray = colorArray.map(x => Array.from(x)[0] == '#' ? x : `#${x}`);

class Particle {
  constructor(x, y, radius, color, scale, rotation, origin, opacity, duration) {		
   	this.x = x;
   	this.y = y;
   	this.radius = radius;
   	this.color = color;
   	this.scale = scale;
   	this.rotation = rotation;
   	this.origin = origin;
   	this.opacity = opacity;
   	this.duration = duration;
    }  
}

function bigCircleDuration () {
	let mapDuration, duration = 4;
/* 	if(mousePos.x < sizeObj.width * 0.3) {
		duration = gsap.utils.mapRange(0, sizeObj.width * 0.3, 1.5, 4, mousePos.x) 
	} else if(mousePos.x > sizeObj.width * 0.6) {
		duration = gsap.utils.mapRange(sizeObj.width * 0.6, sizeObj.width, 140, 1.5, mousePos.x) 
	} */
	return duration;
}

function removeParticle(particle, subParticleArray) {
	
	//remove the particle from sub array
	var particleIndex = subParticleArray.indexOf(particle);
	if (particleIndex !== -1) {
		subParticleArray.splice(particleIndex, 1);
	}	
	//remove the empty sub array from main particleArray
	if(subParticleArray.length == 0) {
		var subIndex = particleArray.indexOf(subParticleArray);
		if (subIndex !== -1) {
			particleArray.splice(subIndex, 1);
		}			
	}

}
function createAnimation() {
	clickCount++;
	oldColor = currentColor ? currentColor : gsap.utils.wrap(colorArray, clickCount+1);
	currentColor = (gsap.utils.wrap(colorArray, clickCount))
	let subParticleArray = []
	smallCircleArray = [];
	for(let i = 0; i < numParticles; i++) {
		let angle = i * step;
		let radius = gsap.utils.random(3, 12);
		let particleOrigin = [0,0];
		let particleDuration = gsap.utils.random(0.4, 1);
		let point = {
			x: (Math.cos(angle * Math.PI / 180) * gsap.utils.random(particleArea*0.082, particleArea)) + mousePos.x,
			y: (Math.sin(angle * Math.PI / 180) * gsap.utils.random(particleArea*0.082, particleArea)) + mousePos.y
		}
		let p = new Particle(point.x, point.y, radius , oldColor, 1, 0, particleOrigin, 1, particleDuration);
		subParticleArray.push(p);
	}
	particleArray.push(subParticleArray)
	let bigCircleRadius =  Math.max(sizeObj.width, sizeObj.height) * 2;
	let bigCircleOrigin = [0, 0];
	let bigCircle = new Particle(mousePos.x, mousePos.y, bigCircleRadius , currentColor, 1, 0, bigCircleOrigin, 1);
	bigCircleArray.push(bigCircle);
	
	let smallCircleRadius =  particleArea * 0.8;
	let smallCircleOrigin = [0, 0];
	let smallCircle = new Particle(mousePos.x, mousePos.y, smallCircleRadius , oldColor, 1, 0, smallCircleOrigin, 1);
	smallCircleArray.push(smallCircle);
		
	let tl = gsap.timeline();
	tl.add('intro')
	.from(subParticleArray, {
		x: mousePos.x,
		y: mousePos.y,
		stagger: 0.0008,
		duration: (i, c) => c.duration,
		ease: 'expo'
	})
	.to(subParticleArray, {
		scale: 0,
		stagger: {
			each: 0.0008,
			onComplete: function(){
				removeParticle(this.targets()[0], subParticleArray)
			}		
		},
		duration: (i, c) => c.duration,
	}, '-=0.7')
 	.fromTo(bigCircle, {
		opacity: 1,
		scale: 0
	},{
		scale: 1,
		opacity: 1,
		duration: bigCircleDuration,
		ease: 'none'
	}, 'intro') 
 	.fromTo(smallCircle, {
		opacity: 1,
		scale: 0
	},{
		scale: 1,
		opacity: 0,
		duration: 0.8,
		ease: 'expo'
	}, 'intro') 
}


function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);	

	bigCircleArray.forEach((particle, count) => {
		ctx.save();	
		ctx.fillStyle = particle.color;
   	ctx.translate(particle.x , particle.y );    
		ctx.scale(particle.scale, particle.scale);
		ctx.translate(particle.origin[0], particle.origin[1] );
		ctx.globalAlpha = particle.opacity;
		ctx.beginPath();		
		ctx.arc(0, 0, particle.radius , 0,2 *  Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.restore();		
	})

	smallCircleArray.forEach((particle, count) => {
		ctx.save();
		ctx.fillStyle = `${particle.color}7f`;
		ctx.strokeStyle = particle.color;
		ctx.lineWidth = 4;
   	ctx.translate(particle.x , particle.y );    
		ctx.scale(particle.scale, particle.scale);
		ctx.translate(particle.origin[0], particle.origin[1] );
		ctx.globalAlpha = particle.opacity;
		ctx.beginPath();
		
		ctx.arc(0, 0, particle.radius , 0,2 *  Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();		
	})
	particleArray.forEach((subParticleArray, count) => {
		subParticleArray.forEach((particle, count) => {
		ctx.save();
		//ctx.shadowBlur = 12;
		//ctx.shadowColor = "black";		
		ctx.fillStyle = particle.color;
   	ctx.translate(particle.x , particle.y );    
		ctx.scale(particle.scale, particle.scale)
		//ctx.translate(particle.origin[0], particle.origin[1] );
		ctx.beginPath();
		
		ctx.arc(0, 0, particle.radius , 0,2 *  Math.PI);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	})	
	})	
}

window.onresize = function (e) {

	sizeObj.width = window.innerWidth;
	sizeObj.height = window.innerHeight;
	canvas.width = sizeObj.width;
	canvas.height = sizeObj.height;
	
	particleArea = Math.min(sizeObj.width, sizeObj.height) * 0.5
	numParticles = sizeObj.width * 0.05;
	step = 360/numParticles;
}

canvas.onpointerdown = function (e) {
	mousePos.x = e.clientX;
	mousePos.y = e.clientY;
	createAnimation()
}
createAnimation();
window.onresize();
gsap.ticker.add(draw);
gsap.delayedCall(2, function() {
	canvas.onpointerdown({clientX: 800, clientY: 600});
})