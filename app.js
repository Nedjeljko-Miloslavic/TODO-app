
const input = document.querySelector("input");
const flex_container = document.querySelector("#flex_container");
var circles_checked = [false];
var card_array = [];
var images_array = [2];
var span_array;
var drag = false;
var grab_start;
var item_counter = document.querySelector("#footer #items span");


input.oninput = ()=>{
	input.style.color = "var(--dark_grayish_blue_1)";
	if(input.value == ""){
		input.style.color = "var(--dark_grayish_blue_3)";
	}
}

input.onkeypress = (event)=>{
	if(event.key=="Enter" && input.value != ""){
		
		var circle = document.createElement("div");
		var span = document.createElement("span");
		var span_2 = document.createElement("div");
		
		span_2.setAttribute("class", "x");
		circle.setAttribute("class", "circle");
		var card = document.createElement("div");
		
		card.setAttribute("class", "card");
		span.innerHTML = input.value;
		flex_container.appendChild(card);
		card.appendChild(circle);
		card.appendChild(span);
		card.appendChild(span_2);
		
	
		circles_checked.push(false);
		var circles_array = [];
		circles_array = document.querySelectorAll(".circle");
		span_array = document.querySelectorAll(".card span");
		card.style.order = span_array.length;
		
		var img = document.createElement("img");
		img.setAttribute("src", "images/icon-check.svg");
		img.setAttribute("alt","check_icon");
		img.style = "position:relative; left:3px;";
		images_array.push(img);
		
		var i = circles_array.length - 1;
		var j = span_array.length - 1;
		var new_card = document.querySelectorAll("#flex_container .card")[j];
		
		//----------Deleting-------
		
		delete_item(j);
		
		
		
		//line-through---------------------------------------
		
		circles_array[i].addEventListener("click", ()=>{
			if(circles_checked[i]==false){
				circles_array[i].appendChild(images_array[i]);
				circles_array[i].classList.add("gradient");
				circles_checked[i] = true;
				card_array[i-1].card_dom.classList.add("line_through");
			}else{
				circles_array[i].removeChild(images_array[i]);
				circles_array[i].classList.remove("gradient");
				circles_checked[i] = false;
				card_array[i-1].card_dom.classList.remove("line_through");
			}
			
		});
		
		
		//------grabbing--------------------------------------
		
		add_new_card(new_card);
		grab(j);
		
		card_array.forEach(card=>{
			card.update(card.card_dom.getBoundingClientRect().top);
		});
		
			
		
	}
	
	
};

//---------Controling visibility-----------
document.querySelector("#switch span:nth-child(2)").onclick = ()=>{
	for(let i=0; i<card_array.length; i++){
		card_array[i].card_dom.classList.remove("invisible");
	}
	var completed = document.querySelectorAll(".line_through");
	for(let i=0; i<completed.length; i++){
		completed[i].classList.add("invisible");
	}
}

document.querySelector("#switch span:nth-child(3)").onclick = ()=>{
	for(let i=0; i<card_array.length; i++){
		card_array[i].card_dom.classList.remove("invisible");
	}
	var active = document.querySelectorAll("#flex_container .card:not(.line_through)");
	for(let i=0; i<active.length; i++){
		active[i].classList.add("invisible");
	}
}

document.querySelector("#switch span:nth-child(1)").onclick = ()=>{
	for(let i=0; i<card_array.length; i++){
		card_array[i].card_dom.classList.remove("invisible");
	}
}



//-------------Class---------------------
class Card{
	constructor(card_dom, order, height, position){
		this.card_dom = card_dom;
		this.order = order;
		this.position = position;
		this.height = height;
		this.click_position = undefined;
		this.grab = false;
		this.move = 0;
		this.dif = 0;
		this.mid = this.position + this.height/2;
	}
	
	update(x){
		this.position = x;
		this.move = 0;
		this.dif = 0;
		this.mid = this.position + this.height/2;
		this.click_position = this.mid;
	}
	
}





//__________FUNCTIONS_______________________________

//------------Stop_drag----------
function stop_drag(j){
	card_array[j].grab = false;
	card_array[j].card_dom.style.top = "0px";
	card_array[j].card_dom.style.zIndex = "0";
	card_array[j].card_dom.style.border = "0";
	card_array[j].card_dom.style.borderBottom = "var(--dark_grayish_blue_5) solid 1px";
	
	for(let i=0; i<card_array.length; i++){
		card_array[i].update(card_array[i].card_dom.getBoundingClientRect().top);
	}
}



//----------------GRABBING-------------------
function grab(j){
	span_array[j].addEventListener("mousedown", (event)=>{
		card_array[j].click_position = event.clientY;
		card_array[j].grab = true;
		card_array[j].dif = card_array[j].click_position - card_array[j].mid;
		card_array[j].card_dom.style.top = card_array[j].dif + "px";
		card_array[j].card_dom.style.zIndex = "1";
		card_array[j].card_dom.style.border = "2px solid blue";
		order_cards();
	});
	
	
	span_array[j].addEventListener("mouseup", ()=>{
		stop_drag(j);
	});
	
	span_array[j].addEventListener("mouseout", ()=>{
		stop_drag(j);
	});
	
	
	span_array[j].addEventListener("mousemove", (event)=>{
		if(card_array[j].grab){
			var move = event.clientY - card_array[j].click_position + card_array[j].dif;
			if(card_array[j].order != 1 && move<=0){
				card_array[j].move = move;
				card_array[j].card_dom.style.top = card_array[j].move + "px";
				
			}
			if(card_array[j].order != card_array.length && move>=0){
				card_array[j].move = move;
				card_array[j].card_dom.style.top = card_array[j].move + "px";
			}
			
			
			for(let i=0; i<card_array.length; i++){
				if((event.clientY < card_array[i].mid && card_array[j].order>card_array[i].order) || (event.clientY > card_array[i].mid && card_array[j].order<card_array[i].order)){
					if(event.clientY < card_array[i].mid && card_array[j].order>card_array[i].order){
						var order_clone = card_array[j].order;
						card_array[j].order = card_array[i].order;
						card_array[i].order = order_clone;
					}else{
						var order_clone = card_array[j].order;
						card_array[j].order = card_array[i].order;
						card_array[i].order = order_clone;
					}
					
					var position_clone = card_array[i].position;
					card_array[i].position = card_array[j].position;
					
					card_array[i].mid = card_array[i].position + card_array[i].height/2;
					
					card_array[j].update(position_clone);
					card_array[j].card_dom.style.top = 0+"px";
					
					card_array[j].card_dom.style.order = card_array[j].order;
					card_array[i].card_dom.style.order = card_array[i].order;
				
					
					//------------Setting the border radius of first card------
					for(let i=0; i<card_array.length; i++){
						if(card_array[i].order == 1){
							card_array[i].card_dom.style.borderRadius = "5px 5px 0px 0px";
						}else{
							card_array[i].card_dom.style.borderRadius = "0px";
						}
					}
					
				}
			}
		}
	});
}


function delete_item(j){
	var x_array = document.querySelectorAll(".x");
	var x = x_array[j];
	x.onclick = (event)=>{
		event.target.parentNode.remove();
		var remaining_cards = document.querySelectorAll("#flex_container .card");
		
		card_array.forEach(card =>{
			card.update(card.card_dom.getBoundingClientRect().top);
			console.log(card);
		});
		order_cards();
	}
}

function add_new_card(new_card){
	var order = window.getComputedStyle(new_card).getPropertyValue("order")*1;
	var height = new_card.getBoundingClientRect().height;
	var position = new_card.getBoundingClientRect().top;
	var card_class = new Card(new_card, order, height, position);
	card_array.push(card_class);
	item_counter.innerHTML = card_array.length+ " ";
}


function order_cards(){
	let finished_order = [];
	for(let i=0; i<card_array.length; i++){
		finished_order.push(0);
	}
	let order = 1;
	var order_array = [];
	card_array.forEach(card=>{
		order_array.push(card.position);
	});
	console.log(order_array);
	for(let j=0; j<order_array.length; j++){
		var compare = 1000;
		for(let i=0; i<order_array.length; i++){
			if(order_array[i]<compare && order_array[i]>0){
				compare = order_array[i];
			}
		}
		for(let i=0; i<order_array.length; i++){
			if(compare==order_array[i]){
				finished_order[i] = order;
				order_array[i] = 0;
				order++;
			}
		}
	}
	console.log(finished_order);
	
	for(let i=0; i<card_array.length; i++){
		if(finished_order[i]!=0){
			card_array[i].order = finished_order[i];
		}
		card_array[i].update(card_array[i].card_dom.getBoundingClientRect().top);
	}
	
	
	
}


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