import { Component, OnInit } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { finalize, expand, take } from 'rxjs/Operators';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

	//Initialize properties
	title: string = "Let the Games Begin!";
	message: string = "";
	playerCards = [];
	dealerCards = [];
	dealerCardsAdditional = [];
	playerScore: number = 0;
	dealerScore: number = 0;
	dealShow: boolean = true;
	hitShow: boolean = false;
	standShow: boolean = false;
	showDeck: boolean = false;
	isDealerStanding: boolean = false;
	isPlayerStand: boolean = false;

	//Set Timer observable to half a second
	timing = timer(500);

  	constructor() { }

  	ngOnInit() {
  	}

  	/**
   	* Only shows the deal button on UI
   	*/
  	public showDeal(): void {
		this.dealShow 	= true;
		this.hitShow 	= false;
		this.standShow 	= false;
  	}

	/**
	* Only show all button except deal button on UI
	*/
	public hideDeal(): void {
		this.dealShow 	= false;
		this.hitShow 	= true;
		this.standShow 	= true;
	}

  	/**
   	* Deals deck
   	*/
	public deal(): void {
	  	this.title = "";
	  	this.message = "";
	  	this.showDeck = true;
	  	this.isDealerStanding = false;
	  	this.isPlayerStand = false;
	  	this.playerScore = 0;
	  	this.dealerScore = 0;
	  	this.playerCards = [];
	  	this.dealerCards = [];
		this.dealerCardsAdditional = [];

	  	this.getPlayerCards();
		this.getDealerCards();
		this.hideDeal();
	}

    /**
    * Hit a card for the player and check for a winner
    */
	public hit(): void {
	  	var value = this.getRandomCard();
		this.playerCards.push(value);
		this.playerScore += value;

		if(this.playerScore >= 21){
			this.isPlayerStand = true;
			this.chooseWinner();
		}
	}

	/**
	* Stand for the player, check if the dealer is standing or hitting
	* and choose winner
	*/
	public stand(): void {
	  	this.isPlayerStand = true;
	  	this.checkDealerStand();
	}

  	/**
   	* Gets a random number between 1 and 11
   	* @return {number} a random number
   	*/
  	public getRandomCard(): number {
		var min = 1;
		var max = 11;
		return Math.floor(Math.random() * (max - min + 1)) + min;
  	}

    /**
    * Gets player's first two cards
    */
	public getPlayerCards(): void {

	  	for(var number = 0; number < 2; number++ )
	  	{
	  		var value = this.getRandomCard();
	  		this.playerCards.push(value);
	  		this.playerScore += value;
	  		value = 0;
	  	}
	}

	/**
	 * Gets the dealer's first two cards
	 */
	public getDealerCards(): void {

	  	this.timing.subscribe(() => {
	  		for(var number = 0; number < 2; number++ )
		  	{
		  		var value = this.getRandomCard();
		  		this.dealerCards.push(value);
		  		this.dealerScore += value;
		  		value = 0;
		  	}
		});
	}

  	/**
    * Dealer stands when their score is between 17 and 21, otherwise hits.
    * Checks if dealer stands or hits
    */
	public async checkDealerStand() {

		//TODO: Find a way to pause after every !isDealerStanding check without async await
		//and promise setTimeout sleep
		//but with some observerable operator instead

	  	if(this.dealerScore >= 17 && this.dealerScore <= 21){
	  		this.isDealerStanding = true;
	  		this.chooseWinner();
	  		return;
	  	}
	  	else if (this.dealerScore > 21)
	  	{
	  		this.chooseWinner();
	  		return;
	  	}
	  	else
	  	{
	  		if(!this.isDealerStanding)
		  	{
		  		var value = this.getRandomCard();
		  		this.dealerCardsAdditional.push(value);
				this.dealerScore += value;	
			}	
			await this.sleep(1200);		
			return this.checkDealerStand();
	  	}
	}

	sleep(ms) {
	  return new Promise(resolve => setTimeout(resolve, ms));
	}


	/**
	 * Chooses the winner based on each score
	 */
	public chooseWinner(): void {

		if(this.playerScore > 21 && this.dealerScore <= 21)
		{
			this.message = "You Bust! Dealer Wins!!";
		}
		else if(this.playerScore <= 21 && this.dealerScore > 21)
		{
			this.message = "Dealer Bust!!! You Win!!";
		} 
		else if(this.playerScore > 21  && this.dealerScore > 21)
		{
			this.message = "You Loose!!";
		}
		else if(this.playerScore == 21)
	 	{
	 		this.message = "Black Jack! You win!!";
	 	}
	 	else if(this.dealerScore == 21)
	 	{
	 		this.message = "Black Jack! Dealer wins!!";
	 	}
	 	else if(this.playerScore < 21 && this.dealerScore < 21)
	 	{
	 		if(this.playerScore > this.dealerScore){
	 			this.message = "You win!!";
	 		}
	 		else if(this.playerScore == this.dealerScore){
	 			this.message = "Its a draw!!";
	 		}
	 		else if(this.dealerScore > this.playerScore){
	 			this.message = "Dealer wins!!";
	 		}
	 	}
	 	else if(this.dealerScore == 21 && this.playerScore == 21)
	 	{
	 		this.message = "Its a draw!!";
	 	}
	 	this.showDeal();
	}

	  /**
   * Gets dealer card after one second
   */
  // public getDealerCard(): void {
  // 	this.oneSecond.pipe(
  // 		finalize(() => {
  // 			console.log("choose winner now");
  // 			//this.chooseWinner();

  // 		})).subscribe(() => {

  // 		this.checkDealerStand();
  // 		if(!this.isDealerStanding){
  // 			this.dealerCard = this.getRandomCard();
  // 			this.dealerScore = this.dealerScore + this.dealerCard;
  // 		}
  //   });
  // }

	  // 		var times = timer(500);
  // 		times.pipe(finalize(() => {
  // 			if(this.dealerScore >= 17 && this.dealerScore <= 21){
  // 				this.chooseWinner();
  // 			}else if (this.dealerScore > 21){
  // 				this.chooseWinner();
  // 			}
  // 		}))
  // 		.subscribe(() => {				  		
		// 	this.dealerCardsAdditional.push(value);
		// 	this.dealerScore += value;
		// });

}
