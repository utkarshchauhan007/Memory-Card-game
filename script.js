class AudioController{
    constructor() {
        this.bgMusic=new Audio('creepy.mp3') ;
        this.flipSound=new Audio('flip.mp3');
        this.matchSound=new Audio('match.mp3') ;
        this.victorySound=new Audio('victory.mp3') ;
        this.gameOverSound=new Audio('gameover.mp3') ;
        this.bgMusic.volume=0.5 ;
        this.bgMusic.loop=true ;
    }
    startMusic(){
        this.bgMusic.play() ;
    }
    stopMusic(){
        this.bgMusic.pause() ;
        this.bgMusic.currentTime=0 ;
    }
    flip()
    {
        this.flipSound.play() ;
    }
    match()
    {
        this.matchSound.play() ;
    }
    victory(){
        this.stopMusic() ;
        this.victorySound.play() ;
    }
    gameOver(){
        this.stopMusic() ;
        this.gameOverSound.play() ;
    }
}

class MixOrMatch{
    constructor(totalTime,cards){
        this.cardsArray=cards ;
        this.totalTime=totalTime ;
        this.timeRemaining=totalTime ;
        this.timer=document.getElementById('tr') ;
        this.ticker=document.getElementById('flips') ;
        this.audiocontroller=new AudioController() ;
    }
    startGame()
    {
         this.cardToCheck=null ;
         this.totalClicks=0; 
         this.timeRemaining=this.totalTime ;
         this.matchedCards=[] ;
         this.busy=true ;
       setTimeout(()=>{
           this.audiocontroller.startMusic() ;
           this.shuffleCards() ;
           this.countdown=this.startCountdown() ;
           this.busy=false ;
       },500) ;
       this.hideCards() ;
       this.timer.innerText=this.timeRemaining ;
       this.ticker.innerText=this.totalClicks ;

    }
    hideCards(){
        this.cardsArray.forEach(card=>{
            card.classList.remove('visible');
            card.classList.remove('matched') ;

        });
    }
    flipCard(card){
     if(this.canFlipCard(card)){
         this.audiocontroller.flip() ;
         this.totalClicks++ ;
         this.ticker.innerHTML=this.totalClicks ;
         card.classList.add('visible') ;

         if(this.cardToCheck)
         {
             this.checkForCardMatch(card)
         }
         else
         {
             this.cardToCheck=card; 
         }
     }
    }
    checkForCardMatch(card)
    {
        if(this.getCardType(card)===this.getCardType(this.cardToCheck))
        {
            this.cardMatch(card,this.cardToCheck) ;
        }
        else
        {
            this.cardMisMatch(card,this.cardToCheck) ;
        }
        this.cardToCheck=null ;
    }
    cardMatch(card1,card2)
    {
  this.matchedCards.push(card1);
  this.matchedCards.push(card2) ;
  card1.classList.add('matched') ;
  card2.classList.add('matched') ;
  this.audiocontroller.match() ;
  console.log('utk')
  if(this.matchedCards.length===this.cardsArray.length)
  this.victory() ;
    }
    cardMisMatch(card1,card2)
    {
this.busy=true;
setTimeout(()=>{
    card1.classList.remove('visible') ;
    card2.classList.remove('visible') ;
    this.busy=false ;
},1000);
    }
    getCardType(card)
    {
        return card.getElementsByClassName('cval')[0].src ;
    }
    
    startCountdown(){
       return setInterval(()=>
       {
           this.timeRemaining--; 

           this.timer.innerText=this.timeRemaining ;
           if(this.timeRemaining===0)
           this.gameOver() ;
       },1000) ;
    }

    gameOver(){
         clearInterval(this.countdown) ;
         this.audiocontroller.gameOver() ;
         document.getElementById('gameover').classList.add('visible') ;

    }
    victory()
    {
        clearInterval(this.countdown) ;
        this.audiocontroller.victory() ;
        document.getElementById('victory').classList.add('visible') ;
        this.hideCards() ;
    }
    shuffleCards(){
        for(let i=this.cardsArray.length-1;i>0;i--){
            let randIndex=Math.floor(Math.random()*(i+1)) ;
            this.cardsArray[randIndex].style.order=i ;
            this.cardsArray[i].style.order=randIndex ;
        }
    }
    canFlipCard(card){
        
         return (!this.busy && !this.matchedCards.includes(card)&& card!=this.cardToCheck) ;
    }
}
function ready()
{
    let overlays=Array.from(document.getElementsByClassName('ovrl-txt')) ;
    console.log(overlays) ;
    let cards=Array.from(document.getElementsByClassName('card')) ;
    let game=new MixOrMatch(60,cards) ;
    overlays.forEach(x =>{
        x.addEventListener('click',()=>{
            x.classList.remove('visible') ;
            game.startGame() ;
            let audiocontroller=new AudioController() ;
          
           

        });
    });
    cards.forEach(card=>{
        card.addEventListener('click',()=>
        {
            game.flipCard(card) ;
        });
    })
        
}
if(document.readyState ==='loading'){
    document.addEventListener('DOMContentLoaded',ready()) ;

}
else{
    ready();
}
