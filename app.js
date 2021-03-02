//CLASSES-------------------------------

class Card{
	constructor(span){
		this.span = span;
		this.top = undefined;
		this.height = undefined;
		this.order = undefined;
		this.mid = undefined;
		this.drag = false;
		this.move = 0;
		this.click_position = undefined;
		this.dif_mid_click = undefined;
		this.completed = false;
	}
}



class Flex_container{
	constructor(){
		this.card_array = [];
		this.card_dom_array = [];
		this.position_array = [];
		this.order_array = [];
		this.dom = document.querySelector("#flex_container");
		this.max_position = undefined;
	}
	
	create_card_element(){
		this.card_dom_array = [];
		this.card_array.forEach(card=>{
			var span = document.createElement("span");
			span.innerHTML = card.span;
			var circle = document.createElement("div");
			circle.setAttribute("class", "circle");
			var inner_circle = document.createElement("div");
			inner_circle.setAttribute("class","inner_circle");
			circle.appendChild(inner_circle);
			var x = document.createElement("div");
			x.setAttribute("class","x");
			var card_dom = document.createElement("div");
			card_dom.setAttribute("class", "card");
			card_dom.appendChild(circle);
			card_dom.appendChild(span);
			card_dom.appendChild(x);
			if(card.order){
				card_dom.style.order = card.order;
			}
			this.card_dom_array.push(card_dom);
		});
		//reference to event listener function
		init_event_listeners(this.card_dom_array);
	}
	
	
	append_to_dom(){
		this.dom.innerHTML = "";
		this.card_dom_array.forEach(card_dom=>{
			this.dom.appendChild(card_dom);
		});
	}
	
	
	determine_position(){
		this.position_array = [];
		this.card_dom_array.forEach(card_dom=>{
			var position = card_dom.getBoundingClientRect().top;
			this.position_array.push(position);
		});
		for(let i=0; i<this.position_array.length; i++){
			this.card_array[i].top = this.position_array[i];
			this.card_array[i].height = this.card_dom_array[i].getBoundingClientRect().height;
			this.card_array[i].mid = this.card_array[i].top + this.card_array[i].height/2;
		}
		this.determine_max_position();
	}
	
	determine_max_position(){
		var max = this.position_array[0];
		for(let i=0; i<this.position_array.length; i++){
			if(max<this.position_array[i]){
				max = this.position_array[i];
			}
		}
		this.max_position = max;
	}
	
	order_by_position(){
		this.order_array = [];
		fill(this.order_array, 0, this.position_array.length);
		var order = 1;
		for(let i=0; i<this.position_array.length; i++){
			var compare = 5000;
			for(let j=0; j<this.position_array.length; j++){
				if(this.position_array[j]<compare && this.position_array[j]!=0){
					compare = this.position_array[j];
				}
			}
			for(let j=0; j<this.position_array.length; j++){
				if(this.position_array[j]==compare && this.position_array[j]!=0){
					this.position_array[j] = 0;
					this.order_array[j] = order;
					order++;
				}
			}
		}
		for(let i=0; i<this.card_array.length; i++){
			this.card_array[i].order = this.order_array[i];
		}
		this.determine_position();
	}
	
	
}





//VARIABLES----------------------------------------
const input = document.querySelector("input");
var flex_container = new Flex_container();
var item_visibility = "all";
var items_left = document.querySelector("#items span");
var body = document.body;
var theme = "dark";
var footer = document.querySelector("#footer");


input.oninput = ()=>{
	input_color();	
}

footer.style.visibility = "hidden";


//ONKEYPRESS------------------------------------
input.onkeypress = (event)=>{
	if(event.key=="Enter" && input.value != ""){
		window.scroll(0,0);
		footer.style.visibility = "visible";
		var card = new Card(input.value);
		flex_container.card_array.push(card);
		flex_container.create_card_element();
		flex_container.append_to_dom();
		flex_container.determine_position();
		flex_container.order_by_position();
		
		set_border_radius();
		make_line_through();
		set_visibility();
	}
}


function init_event_listeners(card_dom_array){
//------------DRAGGING EVENT LISTENERS------------------------------------
	for(let i=0; i<flex_container.card_dom_array.length; i++){
		flex_container.card_dom_array[i].childNodes[1].addEventListener("mousedown", (event)=>{
			var card_dom = flex_container.card_dom_array[i];
			var card = flex_container.card_array[i];
			if(card.drag == false){
				card.click_position = event.clientY;
				card.dif_mid_click = card.click_position - card.mid;
				card.move = card.dif_mid_click;
				moving(card,card_dom,event);
				card.drag = true;
				card_dom.style.zIndex = "1";
				card_dom.style.transform = "scale(1.05,1.1)";
				card_dom.style.border = "blue solid 2px";
				card_dom.style.borderRadius = "10px";
			}
		});
		
		flex_container.card_dom_array[i].childNodes[1].addEventListener("mouseup", (event)=>{
			var card_dom = flex_container.card_dom_array[i];
			var card = flex_container.card_array[i];
			card.move = 0;
			card_dom.style.top = "0px";
			card.dif_mid_click = 0;
			card_dom.style.zIndex = "0";
			card.click_position = card.mid;
			if(card.drag){
				moving(card,card_dom,event);
			}
			card.drag = false;
		});
		
		
		flex_container.card_dom_array[i].childNodes[1].addEventListener("mouseout", (event)=>{
			var card_dom = flex_container.card_dom_array[i];
			var card = flex_container.card_array[i];
			card.move = 0;
			card_dom.style.top = "0px";
			card.dif_mid_click = 0;
			card.click_position = card.mid;
			if(card.drag){
				moving(card,card_dom,event);
			}
		});
		
		
		
		flex_container.card_dom_array[i].childNodes[1].addEventListener("mousemove", (event)=>{
			var card_dom = flex_container.card_dom_array[i];
			var card = flex_container.card_array[i];
			if(card.drag){
				var move = event.clientY - card.click_position + card.dif_mid_click;
				card.move = move;
				moving(card,card_dom,event);
			}
		});
		
		
		
		//DELETING--------------------------------
		flex_container.card_dom_array[i].childNodes[2].addEventListener("click", (event)=>{
			flex_container.card_array.splice(i,1);
			flex_container.create_card_element();
			flex_container.append_to_dom();
			flex_container.determine_position();
			flex_container.order_by_position();
			make_line_through();
			set_visibility();
			set_border_radius();
		});
		
		var clear = document.querySelector("#clear");
		clear.addEventListener("click", ()=>{
			for(let i=0; i<flex_container.card_array.length; i++){
				if(flex_container.card_array[i].completed){
					flex_container.card_array.splice(i,1);
				}
			}
			flex_container.create_card_element();
			flex_container.append_to_dom();
			flex_container.determine_position();
			flex_container.order_by_position();
			make_line_through();
			set_visibility();
			set_border_radius();
		});
		
		
		
		//SET_TO_COMPLETED-----------------------------
		flex_container.card_dom_array[i].childNodes[0].addEventListener("click", event=>{
			if(!flex_container.card_array[i].completed){
				flex_container.card_array[i].completed = true;
			}else{
				flex_container.card_array[i].completed = false;
			}
			make_line_through();
			items_left.innerHTML = document.querySelectorAll("#flex_container .card:not(.line_through)").length+" "; //setting the number of items left
			set_visibility();
		});
	}
}



//CONTROLING_VISIBILITY-------------------------------
document.querySelector("#switch span").addEventListener("click", (event)=>{
	item_visibility = "all";
	set_visibility();
});

document.querySelector("#switch span:nth-child(2)").addEventListener("click", (event)=>{
	item_visibility = "active";
	set_visibility();
});

document.querySelector("#switch span:nth-child(3)").addEventListener("click", (event)=>{
	item_visibility = "completed";
	set_visibility();
});




document.body.addEventListener("mouseup", ()=>{
	for(let i=0; i<flex_container.card_array.length; i++){
		flex_container.card_array[i].drag = false;
		flex_container.card_dom_array[i].style.zIndex = "0";
		flex_container.card_dom_array[i].style.transform = "";
		flex_container.card_dom_array[i].style.border = "";		
		set_border_radius();
		
	}
});




//CHANGING_BACKGROUND_-----------------------------
var switch_to_light = document.querySelector("#images img");
var switch_to_dark = document.querySelector("#images img:nth-child(2)");
switch_to_light.onclick = ()=>{
	theme = "light";
	switch_to_dark.style.visibility = "visible";
	switch_to_light.style.visibility = "hidden";
	body.classList.add("light");
}

switch_to_dark.onclick = ()=>{
	theme = "dark";
	switch_to_dark.style.visibility = "hidden";
	switch_to_light.style.visibility = "visible";
	body.classList.remove("light");
}






//functions-------
function set_visibility(){
	var completed_cards = document.querySelectorAll(".line_through");
	var active_cards = document.querySelectorAll("#flex_container .card:not(.line_through)");
	items_left.innerHTML = active_cards.length+" "; //changing the number of items left
	if(item_visibility=="active"){
		completed_cards.forEach(card=>{
			card.classList.add("invisible");
		});
		active_cards.forEach(card=>{
			card.classList.remove("invisible");
		});
	}else if(item_visibility=="completed"){
		completed_cards.forEach(card=>{
			card.classList.remove("invisible");
		});
		active_cards.forEach(card=>{
			card.classList.add("invisible");
		});
	}else{
		completed_cards.forEach(card=>{
			card.classList.remove("invisible");
		});
		active_cards.forEach(card=>{
			card.classList.remove("invisible");
		});
	}
	flex_container.order_by_position();
	set_visibility_2();
}

function moving(card, card_dom, event){
	if(card.order==1){
		if(card.move>0){
			card_dom.style.top = card.move + "px";
			
		}
	}else if(card.top==flex_container.max_position){
		if(card.move<0){
			card_dom.style.top = card.move + "px";
			
		}
	}else{
		card_dom.style.top = card.move + "px";
		
	}
	card.drag = true;
	flex_container.determine_position();
	flex_container.order_by_position();
	for(let i=0; i<flex_container.card_dom_array.length; i++){
		flex_container.card_dom_array[i].style.order = flex_container.card_array[i].order;
	}
}

function fill(array, element, number){
	for(let i=0; i<number; i++){
		array.push(element);
	}
}

function set_border_radius(){
	for(let i=0; i<flex_container.card_array.length; i++){
		if(flex_container.card_array[i].order == 1){
			flex_container.card_dom_array[i].style.borderRadius = "5px 5px 0px 0px";
			
		}else{
			flex_container.card_dom_array[i].style.borderRadius = "0";
		}
	}
}

function make_line_through(){
	for(let i=0; i<flex_container.card_array.length; i++){
		if(flex_container.card_array[i].completed){
			flex_container.card_dom_array[i].classList.add("line_through");
		}else{
			flex_container.card_dom_array[i].classList.remove("line_through");
		}
	}
}

function input_color(){
	if(theme=="dark"){
		input.style.color = "var(--dark_grayish_blue_1)";
		if(input.value == ""){
			input.style.color = "var(--dark_grayish_blue_3)";
		}
	}else{
		input.style.color = "var(--dark_grayish_blue_3)";
		if(input.value == ""){
			input.style.color = "var(--dark_grayish_blue_1)";
		}
	}
}

function set_visibility_2(){
	let switch_dom = document.querySelectorAll("#switch span");
	if(item_visibility=="all"){
		switch_dom[0].classList.add("blue_color");
		switch_dom[1].classList.remove("blue_color");
		switch_dom[2].classList.remove("blue_color");
	}else if(item_visibility=="active"){
		switch_dom[1].classList.add("blue_color");
		switch_dom[0].classList.remove("blue_color");
		switch_dom[2].classList.remove("blue_color");
	}else{
		switch_dom[2].classList.add("blue_color");
		switch_dom[0].classList.remove("blue_color");
		switch_dom[1].classList.remove("blue_color");
	}
	
}

set_visibility_2();



/*
Your users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Add new todos to the list
- Mark todos as complete
- Delete todos from the list
- Filter by all/active/complete todos
- Clear all completed todos
- Toggle light and dark mode
- **Bonus**: Drag and drop to reorder items on the list
*/