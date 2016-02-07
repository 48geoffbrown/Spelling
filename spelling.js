var w = 0,
    curWord,
    score = 0,
    voices;

window.speechSynthesis.onvoiceschanged = function() {
    voices = window.speechSynthesis.getVoices();
};

function myWords() {
    var mylist = $('#hi').val();
    if (mylist.length < 1) {
        $('#warning').fadeIn();
    } else {
        spellingList = new WordList(mylist, ", ");
        $('.enterWords').remove();
        $('#enterWords').append('<button style="color: black; border: solid; font-weight: bold" id="play" class="btn btn-info" onclick="playWord()">Play Word</button><br><br>')
            .append('<input style="color: black; background-color: lightyellow; border: solid; font-weight: bold" class="form-control" type="text" id="typed" placeholder="enter word here"/><br>')
            .append('<button style="color: black; border: solid; font-weight: bold" id="scoreBtn" class="btn btn-info" onclick="checkWord()">Submit</button>');
        curWord = new Word(spellingList.words[w]);
        utter = new Speak(spellingList.words[w]);
    }
}

function playWord() {
    utter.say();
}

function checkWord() {
    var thisTry = $('#typed').val().toUpperCase();
    w++;

    if (curWord.spelledRight(thisTry)) {
        score++;
        var correct = new Speak("Totally awesome!");
        correct.say();
        $("#correct").slideDown();
    } else {
        var wrong = new Speak("Try again bozo!");
        wrong.say();
        $("#wrong").slideDown();
    }

    if(w < spellingList.words.length) {
        $("#play").slideUp();
        curWord = new Word(spellingList.words[w]);
        utter = new Speak(spellingList.words[w]);
        $('#scoreBtn').text("Next").attr("onclick","next()");
    }

    // change button to grade when you reach the end of the words list.
    if(w == spellingList.words.length) {
        $('#scoreBtn').text("Grade").attr("onclick","grade()").removeClass("btn-info").addClass("btn-warning");
        $("#play").slideUp();
    }
}

function next() {
    $("#play").slideDown();
    $('#typed').val("");
    $('#scoreBtn').text("Submit").attr("onclick","checkWord()");
    $("#correct").slideUp();
    $("#wrong").slideUp();
}

function grade() {
    var grade = (score/spellingList.words.length*100).toFixed(0);
    $("#scoreBtn").slideUp();
    $("#typed").slideUp();
    $("#correct").slideUp();
    $("#wrong").slideUp();
    if (grade > 70) {
        $("#endChuck").slideDown();
        var good = new Speak("Fist bump Chuck!");
        good.say();
        $(".finalScore").slideDown().text("Your final grade is: " + grade + "%");
    }
    else {
        $("#endChuck2").slideDown();
        var bad = new Speak("Train harder!");
        bad.say();
        $(".finalScore").slideDown().text("Your final grade is: " + grade + "%");
    }
}

function WordList(source, delimeter) {
    this.delimeter = delimeter || " ";
    this.words = source.split(this.delimeter);
    this.size = function () {
        return this.words.length;
    };
    this.get = function (i) {
        return new Word(this.words[i]);
    };
    this.sort = function () {
        this.words.sort();
    };
}

function Word(src) {
    this.src = src.toUpperCase();
    this.spelledRight = function (word) {
        return word == this.src;
    };
}

function Speak(message) {
    var msg = new SpeechSynthesisUtterance(message);
    msg.lang = "en";
    msg.voice = voices[3];
    this.say = function () {
        window.speechSynthesis.speak(msg);
    };
}