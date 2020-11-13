"use strict";

var resizeTimer, items, itemData = [], dummyElm,
	hasClipPath, unsupported, loopPosition, scTop;

document.addEventListener('DOMContentLoaded', function() {
	let div = document.createElement("div");
	div.style.cssText = "clip-path: polygon(1px 1px, 9px 1px, 9px 9px, 1px 9px);";
	div.style.cssText += "-webkit-clip-path: polygon(1px 1px, 9px 1px, 9px 9px, 1px 9px)";
	hasClipPath = div.style.length > 0;
	
	let ua = window.navigator.userAgent.toLowerCase();
	let isIos = ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1;
	let isAndroid = ua.indexOf('android') != -1 && ua.indexOf('chrome') != -1;
	
	unsupported = isIos || isAndroid;
	let scprElm = document.getElementById("scpr");
	
	if (unsupported) {
		scprElm.classList.add("unsupported");
		items = scprElm.querySelectorAll("li");
	}
	scTop = window.pageYOffset;
	dummyElm = scprElm.querySelector('.dummy');
	
	onResized();
	window.addEventListener("resize", onResize);
	window.addEventListener("scroll", onScroll);
});

function onResize() {
	if (resizeTimer !== false) clearTimeout(resizeTimer);
	resizeTimer = setTimeout(onResized, 200);
}
function onResized() {
	if (unsupported) gatItemData();
	loopPosition = dummyElm.getBoundingClientRect().top + scTop;
}
function gatItemData() {
	for (let i = 0; i < items.length; i++) {
		let itemRect = items[i].getBoundingClientRect();
		itemData[i] = {
			div: items[i].firstElementChild,
			top: itemRect.top + scTop,
			left: itemRect.left,
			right: itemRect.right,
			btm: itemRect.bottom + scTop
		}
	}
	clipScroll();
}

function onScroll() {
	scTop = window.pageYOffset;
	if (unsupported) clipScroll();
	if (scTop >= loopPosition) {
		window.scrollTo(0, 1);
	}
}
function clipScroll() {
	let left = itemData[0].left + "px";
	let right = itemData[0].right + "px";
	
	for (let i = 0; i < items.length; i++) {
		let top = itemData[i].top - scTop + "px";
		let btm = itemData[i].btm - scTop + "px";
		
		if (!hasClipPath) {
			itemData[i].div.style["clip"] = "rect(" + top + "," + right + "," + btm + "," + left + ")";
		} else {
			let clipPath = left + " " + top + "," + right + " " + top + "," + right + " " + btm + "," + left + " " + btm;
			itemData[i].div.style["-webkit-clip-path"] = "polygon(" + clipPath + ")";
			itemData[i].div.style["clip-path"] = "polygon(" + clipPath + ")";
		}
	}
}
function topScroll(){
  if(document.scrollingElement.scrollTop < 10){
    document.scrollingElement.scrollTop = 0;
  }
  else{
    document.scrollingElement.scrollTop = document.scrollingElement.scrollTop / 1.1;
    setTimeout(topScroll , 10);
  }
}