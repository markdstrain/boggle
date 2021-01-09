class Game {
    constructor(boardId,totalTime=60){
// calling out for the board
        this.board = $('#' + boardId);

// focusing on the input at beginning
        this.doc = $(document).ready(function(){
            $('#words-input').focus();
        })
        
// calling out for the time
        this.timeRemaining = totalTime;
        this.showTimer();
        this.timer = setInterval(this.startCountDown.bind(this),1000);

// calling out for the word
        $('#word-input-form').on('submit',this.handleSubmit.bind(this))

        this.words = new Set();

        // scoring
        this.score = 0;

// Play Again
        $('#play-again').on('click',function reload(){
            location.reload(true);
        })
    }



 // Timing function Section
    showTimer(){
        $('#timer',this.board).text(this.timeRemaining);
    }

    async startCountDown(){
            
        this.timeRemaining-=1;
        this.showTimer();
                
        if(this.timeRemaining === 0){
            this.gameOver();
            }
    }



    
// Word Handling function Section
    async handleSubmit(evt){
        evt.preventDefault();
       
        let word = $('#words-input').val();
        if(!word) return;

        if(this.words.has(word)) {
            this.showMessage(`You've already found ${word}`,'bad');
            $('#words-input').val('');
            return;
        }


    
//posting a get request for the word
        const resp = await axios.get('/check-word', {params: { word: word}});
        
        if(resp.data.result === "not-word"){
            this.showMessage(`${word} is not a valid word`,'bad')   
        }
        else if(resp.data.result === "not-on-board"){
            this.showMessage(`${word} can't be constructed with this board`,
            'bad')
        }
        else {
            this.listWord(word);
            this.showMessage(`Added: ${word}`,'good')
            
        }
        
        $('#words-input').val('');

        }


//posting the word to the board

    listWord(word){

        let $foundWord = ($('<li>',{text:word}))
        $foundWord.addClass()
        $('.listed-words').append($('<li>',{text:word}));
        this.words.add(word);
        
        //send to scoring
        this.score += word.length;
        this.showScore()
        
    }

//showing messages

    showMessage(message, cls){
        $('.message',this.board)
        .text(message)
        .addClass(`${cls}`)

        setTimeout(()=>{
            $('.message',this.board)
            .removeClass(`${cls}`)
            .text('')
        },1700);
        
        this.doc = $(document).ready(function(){
            $('#words-input').focus();
        })
    }


//scoring section
    showScore(){
        if(this.score < 10){
             $('#c-score',this.board).text('0'+this.score)
        }
        else{
            $('#c-score',this.board).text(this.score)
        }
    }




    
// Things todo after the game is over
    async gameOver(){

        clearInterval(this.timer);
        $('#word-input-form',this.board).hide();
        const resp = await axios.post('/post-score', {score: this.score});
        
        if(resp.data.brokeRecord){
            this.showMessage(`New record: ${this.score}`,'good');
        }else{
            this.showMessage(`Final score: ${this.score}`,'good');
        }
    }

   
}
    