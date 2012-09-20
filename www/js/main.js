var xmlWorkFlow = null;
var historyCount = 0;
var toolAnswers = null;
var hasLocalStorage = testLocalStorage();
var isPhoneGapRunning = false;
var currentTool = '';

function ICDCode(codeID, code, codeDescription) {
    this.codeID = codeID;
    this.code = code;
    this.codeDescription = codeDescription;
}

function ICDCodeList(codeListID, listTitle, codeIDs, listType ) {
    this.codeListID = codeListID;
    this.listTitle = listTitle;
    this.codeIDs = codeIDs;
    this.listType = listType;
}

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log('phonegap is running');
    isPhoneGapRunning = true;
}


function hideSiblings(child) {
    var thisIndex = $('#'+child).index();
    console.log('Index is ' + thisIndex);
    $('#'+child).siblings().not(':lt('+thisIndex+')').hide();    
    //    $(child).not(':eq(0)').hide();
    
}
function removeSiblings(child) {
    var thisIndex = $('#'+child).index();
    var itemCount = $('#'+child).siblings().each(function(){
        if(thisIndex < $(this).index()) $(this).remove();
    });
    
}
function getDataURL(dataFile) {
    var result = '../../data/';
    if(isPhoneGapRunning) {
        if(device.name == 'iPhone Simulator') {
            //result = 'data/'
        }
    }
    result += dataFile;    
    return result;
}
function loadAWorkflow(xmlFile) {
    console.log(getDataURL(xmlFile));
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url:getDataURL(xmlFile),
        dataType: 'xml',
        success: function(data){
            console.log('xml success');
            xmlWorkFlow = $(data);
            workflowCcount = 0;
            parseWorkflow(xmlWorkFlow, 0, 0, 0);
            $.mobile.hidePageLoadingMsg();
        }
    })
}
function loadBWorkflow(xmlFile) {
    console.log(getDataURL(xmlFile));
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url:getDataURL(xmlFile),
        dataType: 'xml',
        success: function(data){
            console.log('xml success');
            xmlWorkFlow = $(data);
            workflowCcount = 0;
            parseWorkflow(xmlWorkFlow, 0, 0, 0);
            $.mobile.hidePageLoadingMsg();
        }
    })
}

function loadCWorkflow(xmlFile) {
    console.log(getDataURL(xmlFile));
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url:getDataURL(xmlFile),
        dataType: 'xml',
        success: function(data){
            console.log('xml success');
            xmlWorkFlow = $(data);
            parseWorkflow(xmlWorkFlow, 0, 0, 0);
            $.mobile.hidePageLoadingMsg();
        }
    })
}
function loadICDWizard(xmlFile) {
    console.log(getDataURL(xmlFile));
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url:getDataURL(xmlFile),
        dataType: 'xml',
        success: function(data){
            console.log('xml success');
            xmlWorkFlow = $(data);
            workflowCcount = 0;
            parseICDflow(xmlWorkFlow, 0, 0, 0);
            $.mobile.hidePageLoadingMsg();
        }
    })
}
function loadNeck(xmlFile) {
    console.log(getDataURL(xmlFile));
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url:getDataURL(xmlFile),
        dataType: 'xml',
        success: function(data){
            console.log('xml success');
            xmlWorkFlow = $(data);
            workflowCcount = 0;
            parseWorkflow(xmlWorkFlow, 0, 0, 0);
            $.mobile.hidePageLoadingMsg();
        }
    })
}
function loadVestibular(xmlFile) {
    console.log(getDataURL(xmlFile));
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url:getDataURL(xmlFile),
        dataType: 'xml',
        success: function(data){
            console.log('xml success');
            xmlWorkFlow = $(data);
            workflowCcount = 0;
            parseWorkflow(xmlWorkFlow, 0, 0, 0);
            $.mobile.hidePageLoadingMsg();
        }
    })
}



function loadCoding() {
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url:getDataURL('icd9.xml'),
        dataType: 'xml',
        success: function(data){
            console.log('xml success');
            xmlWorkFlow = $(data);
            parseCodes(xmlWorkFlow);
            $.mobile.hidePageLoadingMsg();
        }
    })
}

function loadQuestions(xmlFile) {
    console.log(getDataURL(xmlFile));
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url:getDataURL(xmlFile),
        dataType: 'xml',
        success: function(data){
            console.log(xmlFile + ' success');
            xmlWorkFlow = $(data);
            setTimeout('parseQuestions(xmlWorkFlow); $.mobile.hidePageLoadingMsg();',250);
        },
        statusCode: {
            404: function(){
                console.log('status 404 page not found');
            }
        },
        error: function(response) {
            console.log(response);
        }
    })
}
function parseQuestions(xmlData) {
    $.mobile.showPageLoadingMsg();
    var questionare = $(xmlData).find('questionare');
    var html ='<div><p>' + questionare.find('title').text() + '</p>';
    html += '<p>' + questionare.find('desc').text() + '</p>';

    html += '<a href="javascript:void(0);" id="cmdContinue" data-role="button" onclick="$(this).fadeOut().parent().next().fadeIn(); return false;" data-theme="b" style="display:none;" >continue</a>';
    html += '</div>\n' ;

    var firstUnAnswered = false;
    var showContinueButton = true;

    var questions = questionare.find('questions').children('question');
    var answers = questionare.find('answers').children('answer');
    questions.each(function(){
        var questionID = 'question-' + $(this).attr('id');
        var storedValue = getKeyValue('mtbi-'+ currentTool +'-' + questionID);
        var displayIt = 'style="display:none;"';
        //displayIt = '';
        var questionType = $(this).attr('type');
        if (storedValue != null) {
            firstUnAnswered = true;
            displayIt = '';
            showContinueButton = false;
        } else {
            if(firstUnAnswered) {
                displayIt = '';
                firstUnAnswered = false;
            }
        }
        html += '<div data-role="fieldcontain" id="' + questionID + '" ' + displayIt + '>';
        if(questionType == 'singleSelect') html += createSingleSelect($(this),answers, storedValue);
        if(questionType == 'slider') html += createSlider($(this), answers, storedValue);
        if(questionType == 'segmented') html += createSegmented($(this), answers, storedValue);
        html += '</div>\n';
    });
    displayIt = 'style="display:none;"';
    if(firstUnAnswered) displayIt = '';
    html += '<div data-role="fieldcontain" ' + displayIt + ' id="divMeasureResults" ><label for="measureResults" id="lblMeasureResults">Results:</label><textarea cols="40" rows="8" name="measureResults" id="measureResults" readonly="readonly" style="color:white;background-color:rgba(0,0,0,0.4);"></textarea>\n';
    html += '<div data-role="collapsible" data-theme="d" data-collapsed="true" ><h3>Assessment Details</h3>' + $(questionare).find('content').text()  + '</div>\n';
    html += '</div>\n';
    console.log(html);
    $('#questionForm').html(html).trigger('create');
    hideZeroValues();
    if(showContinueButton) $('#cmdContinue').fadeIn();
    var score = computeScore(questionare);
    var specialInstructions = getSpecialInstructions(questionare);
    var scoreComment = getScoreComment(questionare, score);
    $('#measureResults').val(score + ((scoreComment != '') ? ' - ' + scoreComment : '') + '\n'+specialInstructions);
    $('#measureResults').keyup();
    $.mobile.hidePageLoadingMsg();
}


function hideZeroValues() {
    $("div.ui-controlgroup-controls:visible").each(function(){
        var returnValue = valueOfRadioGroup($(this));
        if(returnValue == 0) {
            $(this).hide();
        }
    });
}

function valueOfRadioGroup(group) {
    var val = null;
    $("input[type='radio']:first", $(group)).each(function(){
        var question = $(this).attr('name');
        val = getKeyValue('mtbi-'+ currentTool +'-'+question);
        //console.log(val);
    });
    return val;
}
function createMultiSelectCode(target, step, branchID, positiveOrNeg, codeListItem, codes) {
    
    var html = '<fieldset data-role="controlgroup">';
    html += '<legend>' + codeListItem.listTitle + '</legend>\n';
    var codeListID = 'codeList-' + codeListItem.codeListID;
    var codeArray = codeListItem.codeIDs.split(",");
    for (var i in codeArray) {
        var possibleCode = getPossibleCode($(codes), codeArray[i]);
        html += '<input type="checkbox" name="' + codeListID + '" id="' + codeListID + '-' + i + '" value="' + possibleCode.code + '" title="' + possibleCode.codeDescription + '" ';
        html += ' onchange="checkPickedCode(\''+target+'\', '+step+',' + branchID + ',' + positiveOrNeg   + ',this);" />';
        html += '<label for="' + codeListID + '-' + i + '">'    + possibleCode.code + ' ' + possibleCode.codeDescription + '</label>';
    }
    html += '</fieldset>';
    return html;
}

//newContainerID,(currentWFC + 1), branchIds[0], 0
function createSingleSelectCode(target, step, branchID, positiveOrNeg, codeListItem, codes) {
    
    var html = '<fieldset data-role="controlgroup">';
    html += '<legend>' + codeListItem.listTitle + '</legend>\n';
    var codeListID = 'codeList-' + codeListItem.codeListID;
    var codeArray = codeListItem.codeIDs.split(",");
    for (var i in codeArray) {
        var possibleCode = getPossibleCode($(codes), codeArray[i]);
        html += '<input type="radio" name="' + codeListID + '" id="' + codeListID + '-' + i + '" value="' + possibleCode.code + '" title="' + possibleCode.codeDescription + '" ';
        html += ' onchange="radioPickedCode(\''+target+'\', '+step+',' + branchID + ',' + positiveOrNeg + ',this);" />';
        html += '<label for="' + codeListID + '-' + i + '">'    + possibleCode.code + ' ' + possibleCode.codeDescription + '</label>';
    }
    html += '</fieldset>';
    return html;
}

function createSegmented(question,answers,storedValue) {
    var displayIt = (storedValue == '0') ? 'style="display:none;"' : '';
    var html = '<fieldset class="likert1-10" data-role="controlgroup" data-type="horizontal"';
    html += ' oldvalue="' + storedValue + '" >';
    html += '<legend>' + question.attr('title') + '</legend>\n';
    var questionID = 'question-' + question.attr('id');
    var allAnswersArray = question.attr('answerIds').split(",");
    var altAnswersArray = question.attr('altAnswerIds').split(',');
    var allowBypass = question.attr('allowbypass');
    var minLabel = '';
    var maxLabel = '';
    var onchange = question.attr('onchange');
    minLabel = getPossibleAnswer($(answers), allAnswersArray[0]).attr('desc');
    maxLabel = getPossibleAnswer($(answers), allAnswersArray[allAnswersArray.length-1]).attr('desc');
    for (var i in allAnswersArray) {
        var possibleAnswer = getPossibleAnswer($(answers), allAnswersArray[i]);
        var dataTheme = '';
        for(var j in altAnswersArray) 
            if(allAnswersArray[i] == altAnswersArray[j]) dataTheme = ' class="mtbi-shaded" ';
        html += '<input ' + dataTheme + ' type="radio" name="' + questionID + '" id="' + questionID + '-' + i + '" value="' + possibleAnswer.attr('value') + '" ';
        if(storedValue == possibleAnswer.attr('value')) html += ' checked="checked"';
        if(onchange != null) {
            html += ' onchange="' + onchange + '" />';
        } else {
            html += ' onchange="radioPicked(this);" />';

        }
        html += '<label ' + dataTheme + ' for="' + questionID + '-' + i + '">'    + possibleAnswer.attr('value') + '</label>';
    }
    html += '<div style="width:100%;"><span class="minLabel">' + minLabel + '</span><span class="maxLabel">' + maxLabel + '</span></div>'
    //console.log(storedValue);
    if(allowBypass != null) {
        if(allowBypass == 'yes') {
            html += '</fieldset>';
            html += '<fieldset>';
            html += '<input type="checkbox" name="' + questionID + '-toggle" id="' + questionID + '-toggle" onchange="byPassQuestion($(this),\'' + questionID + '\');"';
            if(storedValue == '0') {
                html += ' checked="checked"';
            }
            html += '/>';
            html += '<label for="' + questionID + '-toggle">I don\'t do this activity</label>';
        }
    }
    html += '</fieldset>';
    return html;
}
function createSlider(question, answers,storedValue) {
    var dataTheme = '';
    var questionID = 'question-' + question.attr('id');
    var allAnswersArray = question.attr('answerIds').split(",");
    var altAnswersArray = question.attr('altAnswerIds').split(',');
    var allowBypass = question.attr('allowbypass');
    var html = '<fieldset data-role="controlgroup" data-type="range">';
    html += '<label ' + dataTheme + ' for="' + questionID + '-1">'    +question.attr('title') + '</label>';
    html += '<input type="range" name="' + questionID + '-1" id="' + questionID + '-1" ';
    html += 'value="' + 0 +'" min="0" max="100" ';
    html += 'data-theme="e" ';
    //html += 'onchange="console.log(\'slid\');" />';
    html += '<div style="width:100%;"><span>Not at All</span><span style="float:right;">A great deal</span></div>'
    if(allowBypass != null) {
        if(allowBypass == 'yes') {
            html += '</fieldset>';
            html += '<fieldset>';
            html += '<input type="checkbox" name="' + questionID + '-toggle" id="' + questionID + '-toggle" onchange="byPassQuestion($(this),\'' + questionID + '\');" />';
            html += '<label for="' + questionID + '-toggle">I don\'t do this activity</label>';
        }
    }
    html += '</fieldset>';
    return html;
}
function createSingleSelect(question,answers,storedValue) {
    var html = '<fieldset data-role="controlgroup">';
    html += '<legend>' + question.attr('title') + '</legend>\n';
    var questionID = 'question-' + question.attr('id');
    var allAnswersArray = question.attr('answerIds').split(",");
    var altAnswersArray = question.attr('altAnswerIds').split(',');
    for (var i in allAnswersArray) {
        var possibleAnswer = getPossibleAnswer($(answers), allAnswersArray[i]);
        var dataTheme = '';
        for(var j in altAnswersArray) if(allAnswersArray[i] == altAnswersArray[j]) dataTheme = ' class="mtbi-shaded" ';
        html += '<input ' + dataTheme + ' type="radio" name="' + questionID + '" id="' + questionID + '-' + i + '" value="' + possibleAnswer.attr('value') + '" ';
        if(storedValue == possibleAnswer.attr('value')) html += ' checked="checked"';
        html += ' onchange="radioPicked(this);" />';
        html += '<label ' + dataTheme + ' for="' + questionID + '-' + i + '">'    + possibleAnswer.attr('title') + '</label>';
    }
    html += '</fieldset>';
    return html;
}

function maf1change(item) {
    if($(item).attr('value') == '1') {
        $("div[data-role='fieldcontain']").show();
        if(xmlWorkFlow != null){
            questionare = $(xmlWorkFlow).find('questionare');
        }
        $("input[type='radio']").each(function(){
            if($(this).attr('id') == $(item).attr('id')){
                saveKeyValue('mtbi-'+ currentTool +'-'+$(this).attr('name'),$(item).attr('value'));
            } else {
                $(this).attr('checked',false).checkboxradio('refresh');
                if($(this).attr('name') != $(item).attr('name')) {
                    saveKeyValue('mtbi-'+ currentTool +'-'+$(this).attr('name'),'0');
                }
            }
        });
        $("input[type='checkbox']").attr('checked',false).checkboxradio('refresh');
        var score = computeScore(questionare);
        var specialInstructions = getSpecialInstructions(questionare);
        var scoreComment = getScoreComment(questionare, score);
        $('#measureResults').val(score + ((scoreComment != '') ? ' - ' + scoreComment : '') + '\n'+specialInstructions);
        $('#measureResults').keyup();

        gotoResults();
    } else {
        radioPicked(item);
    }
}

function byPassQuestion(item, questionName) {
    var checked = $(item).is(':checked');
    $("input[name='" + questionName + "']").attr('checked',false).checkboxradio('refresh');
    if(checked) {
        $('#'+ questionName + ' .ui-controlgroup-controls').fadeOut('slow');
        radioPicked($('#'+questionName+'-1'));
    } else {
        $('#'+ questionName + ' .ui-controlgroup-controls').fadeIn('slow');
    }
}
function radioPicked(item) {
    var position = null;
    var showResults = false;
    var questionare = null;
    if(xmlWorkFlow != null){
        questionare = $(xmlWorkFlow).find('questionare');
    }
    showNextQuestion($('#' + $(item).attr('id')), questionare);
    var val = 0;
    var groupName = $(item).attr('name');
    $("input[type='radio'][name='"+groupName+'"]').each(function(){
        if($(this).is(':checked')) val = $(this).attr('value');
    });
    saveKeyValue('mtbi-'+ currentTool +'-'+groupName,val);
    getAnswer($('#' + $(item).attr('id')));
    var score = computeScore(questionare);
    var specialInstructions = getSpecialInstructions(questionare);
    var scoreComment = getScoreComment(questionare, score);
    $('#measureResults').val(score + ((scoreComment != '') ? ' - ' + scoreComment : '') + '\n'+specialInstructions);
    $('#measureResults').keyup();
}

function radioPickedCode(target, step, branchID, item, currentWFC) {
    var position = null;
    var showResults = false;
    var workflow = null;
    if(xmlWorkFlow != null){
        lists = $(xmlWorkFlow).find('lists');
    }
    var val = null;
    var codeList = $(item).attr('name');
    $("input[type='radio'][name='"+codeList+'"]').each(function(){
        if($(this).is(':checked')) {
            val = new ICDCode(0, $(this).attr('value'), $(this).attr('title'));
        } 
    });
    if(val.code != 'Skip') addCode(val);
    branchICDGuide(target , step , branchID  , 0)
}
function checkPickedCode(target, step, branchID, positiveornot, item) {
    var val = new ICDCode(0, $(item).attr('value'), $(item).attr('title'));;
    if($(item).is(':checked')) {
        toggleCode(val);
    } else {
        toggleCode(val);
    }
}

function getAnswer(item) {
    console.log($('.ui-btn-text', $(item).parent()).html());
    return '';
}
function showNextQuestion(item, questionare) {
    var curQuestion = $('#' + item.attr('name'));
    var nextQuestion = curQuestion.next();
    while(nextQuestion != null && shouldSkip(nextQuestion, questionare)) {
        nextQuestion = nextQuestion.next();
    }
    if(nextQuestion != null) {
        if(nextQuestion.attr('id') == 'divMeasureResults') {
            showResults = true;
            $('#cmdResults').fadeIn();
        }
        if(!$(nextQuestion).is(":visible")) {

            position = $(nextQuestion).fadeIn('slow').position();
            if(position != null) {
                $.mobile.silentScroll(position.top - 200);
            }
        }
    }
}

function getSpecialInstructions(xmlQuestionare){
    var results = '';
    var joinType = '';
    $(xmlQuestionare).find('special').each(function(){
        if(joinType == ''){
            if(getSpecialInstruction($(this))) results += $(this).attr('text') + '\n';
        } else if(joinType == 'and') {
            if(getSpecialInstruction($(this))) {
                results += $(this).attr('text') + '\n';    
            } else {
                results = '';
            }
        } else if(joinType == 'or') {
            if(getSpecialInstruction($(this))) results += $(this).attr('text') + '\n';
        } else if(joinType == 'first' && results == '') {
            if(getSpecialInstruction($(this))) results += $(this).attr('text') + '\n';
        }
        joinType = $(this).attr('join');
    });
    return results;
}

function getSpecialInstruction(xmlInstruction) {
    var specialInstructions = true;
    $(xmlInstruction).find('specialStep').each(function(){
        var typeOfSpecial = $(this).attr('type');
        var valueSpecial = parseInt($(this).attr('value'));
        if(typeOfSpecial == 'questionInSpec') {
            if(getSpecialStep($(this)) < valueSpecial) specialInstructions = false;
        }
    });
    return specialInstructions;
}

function getSpecialStep(xmlStep) {
    var specialStep = 0;
    $(xmlStep).find('criteria').each(function(){
        var scoreVal = parseFloat($(this).attr('valueOver'));
        var score = getKeyValue('mtbi-'+ currentTool +'-question-'+$(this).attr('questionId'));
        if(score != null) {
            if(parseFloat(score) > scoreVal) specialStep++;
        }
    });
    return specialStep;
}
function getPossibleAnswer(answers, answerID) {
    var result = null;
    answers.each(function(){
        if($(this).attr('id') == answerID) {
            result = $(this);
        }
    });
    return result;
}
//function ICDCodeList(codeListID, listTitle, codeIDs, listType ) {
//id="0" title="800.xx - 804.xx and 850.xx - 554.xx Series" codeIds="1,2,3,4,5,6,7,8,9,10" type="single" />

function getCodeList(lists, listID) {
    var result = null;
    lists.each(function(){
        if($(this).attr('id') == listID) {
            result = new ICDCodeList($(this).attr('id'),$(this).attr('title'), $(this).attr('codeIds'), $(this).attr('type') );
        }
    });
    return result;
}
function getPossibleCode(codes, codeID) {
    var result = null;
    codes.each(function(){
        if($(this).attr('id') == codeID) {
            result = new ICDCode($(this).attr('id'), $(this).attr('code'), $(this).attr('desc'));
        }
    });
    return result;
}

function clearQuestions() {
    $('input:radio').attr("checked",false).checkboxradio("refresh");
    $('div[data-role="fieldcontain"]').each(function(){
        removeKey('mtbi-'+ currentTool +'-'+$(this).attr('id'));
        $(this).fadeOut();
    });
    $('.ui-controlgroup-controls').fadeIn();
    $('input:[type="checkbox"]').attr('checked',false).checkboxradio('refresh');
    $('#cmdContinue').fadeIn();
    $('#cmdResults').fadeOut();

}
function clearCoding() {
    $('#guideSteps').html('');
    $('#codingResults').html('');
    $('#codingResultsDiv').hide('fade');
    $('#cmdSendMessage').hide('fade');

    workflowCcount = 0;
    parseICDflow(xmlWorkFlow, 0, 0, 0);
}

function gotoResults() {
    var position =$('#divMeasureResults').position();
    $.mobile.silentScroll(position.top);
}

function shouldSkip(question, questionare) {
    var result = false;
    var questionID = $(question).attr('id');
    $(questionare).find('skipRule').each(function(){
        //When there is a need, we will ad Skip Processing...
    });
    return result;
}
function getScoreComment(questionare, score) {
    var scoreComment = '';
    questionare.find('scoringrange').each(function(){
        var lowScore = parseInt($(this).attr('lowscore'));
        var highScore = parseInt($(this).attr('highscore'));
        if(score >= lowScore && score <= highScore) {
            scoreComment = $(this).attr('text');
        }
    })
    return scoreComment;
}

function computeScore(questionare) {
    var result = 0;
    var questions = questionare.find('questions');
    questionare.find('scoring').each(function(){
        result += getScoring($(this),questions);
    });
    return Math.round(result*10)/10;
}

function getScoring(xmlScoring, xmlQuestions) {
    var result = 0;
    $(xmlScoring).find('scoringStep').each(function() {
        var scoringResult = getScoringStep($(this),xmlQuestions);
        //console.log(scoringResult, result);
        result += scoringResult;
    });
    return result;
}

function getScoringStep(xmlScoringStep,xmlQuestions) {
    var result = 0.0;
    var scoreType = $(xmlScoringStep).attr('scoreType');
    var questionArray = $(xmlScoringStep).attr('questionIds').split(",");
    var i = 0;
    var questionID = '';
    var question = null;
    var weight = 0.0;
    var newValue = 0;
    if(scoreType == 'sum'){
        for (i in questionArray) {
            questionID = questionArray[i];
            if(questionID != ''){
                question = $(xmlQuestions).find('#'+questionID)
                weight = parseFloat(question.attr('weight'));
                newValue = getKeyValue('mtbi-'+ currentTool +'-question-' + questionArray[i]);
                if (newValue != null) {
                    result += parseFloat(newValue) * weight;
                }
            }
        }
    } else if (scoreType == 'avg') {
        for (i in questionArray) {
            if(questionID != '') {
                question = $(xmlQuestions).find('#'+questionID)
                weight = parseFloat(question.attr('weight'));
                newValue = getKeyValue('mtbi-'+ currentTool +'-question-' + questionArray[i]);
                if (newValue != null) {
                    result += parseFloat(newValue) * weight;
                }
            }
        }
        result = result/questionArray.length;
    } else if (scoreType == 'avgoverzero') {
        var numberToAverage = 0;
        for (i in questionArray) {
            questionID = questionArray[i];
            if(questionID != '') {
                question = $(xmlQuestions).find('#'+questionID)
                weight = parseFloat(question.attr('weight'));
                newValue = getKeyValue('mtbi-'+ currentTool +'-question-' + questionArray[i]);
                if (newValue != null) {
                    if(newValue > 0){
                        result += parseFloat(newValue) * weight;
                        numberToAverage++;
                    }
                }
            }
        }
        if(numberToAverage > 0) result = result/numberToAverage;
    }
    return result;
}


function parseCodes(xmlData) {
    var currentIndex = 0;
    var html = '<ul data-role="listview" id="icdCodeList" data-theme="c" data-dividertheme="b"></ul>';
    $('#icdCodes').html(html);
    var items = xmlData.children('items');
    html = buildList($(items));
    $('#icdCodeList').html(html).listview();//use listview('refresh') if it's changed.'
}

function buildList(xmlData) {
    var html = '';
    var items = xmlData.children('item');
    items.each(function(){//pulled every item.
        html += '<li data-role="list-divider" role="heading"><h3>' + $(this).attr('title') + '</h3>';
        if($(this).children('item').length > 0) html += buildSubList($(this));
        html += '</li>';
    });
    return html;
}

function buildSubList(xmlData) {
    var html = '';
    var items = xmlData.children('item');
    items.each(function(){//pulled every item.
        if($(this).children('item').length > 0) {
            html += '<li><h3>' + $(this).attr('title') + '</h3>';
            html += '<ul data-theme="c" data-dividertheme="b">' + buildSubList($(this)) + '</ul>';
        } else {
            if($(this).attr('link') != '') {
                html += '<li><a href="' + $(this).attr('link') + '"><h3>' + $(this).attr('title') + '</h3></a>';
            } else {
                html += '<li><h3>' + $(this).attr('title') + '</h3>';
                if($(this).text() != '') html += '<ul data-theme="c" data-dividertheme="b"><li>' + $(this).text() + '</li></ul>';
            }
        }
        html += '</li>';
    });
    return html;
}
function parseICDflow(xmlData, workflowCount, stepIndex, positiveOrNeg) {
    var currentIndex = 0;
    var nextPiece = false;
    var currentStep = stepIndex;
    var currentWFC = workflowCount;
    var codeList = xmlData.find('lists');
    codeList = codeList.children('list');
    var codes = xmlData.find('codes').children('code');

    $('step',xmlData).each(function(){
        currentIndex = parseInt( $(this).attr('id'));
        if(currentStep == currentIndex){
            var branchLabels = $(this).attr('branchLabels').split(','),
            branchIds = $(this).attr('branchIds').split(','),
            codeListId = $(this).attr('codes'),
            stepTitle = $(this).find('title').text(),
            stepContent = $(this).find('content').text(),
            stepDetailedContent = $(this).find('detailedContent').text(),
            newContainerID = 'stepDiv'+currentWFC;
            $('#guideSteps').append ('<div id="' + newContainerID + '" style="display:none;"></div>');
            var html = '';
            html += '<div class="mtbi-outer-rounded" data-theme="b">';
            if(stepTitle != '') html += '<h4>' + stepTitle + '</h4>';
            if(stepContent != '') html +='<div>' + stepContent + '</div>';
            if(stepDetailedContent != '') html +='<div>' + stepDetailedContent + '</div>';
            if(codeListId == '' && branchLabels[0] != '') {
                switch(branchLabels.length) {
                    case 0:
                        nextPiece = true;
                        break;
                    case 1:
                        html += '<a href="javascript:void(0);" onclick="branchICDGuide(\''+ newContainerID + '\',' + (currentWFC + 1) + ',' + branchIds[0] + ',0);" data-role="button" data-theme="b" >' + branchLabels[0] + '</a>';
                        break;
                    case 2:
                        html += '<div class="ui-grid-a"><div class="ui-block-a" >';
                        html += '<a href="javascript:void(0);" data-role="button" onclick="branchICDGuide(\''+ newContainerID + '\',' + (currentWFC + 1) + ',' + branchIds[0] + ',1);">' + branchLabels[0] + '</a>';
                        html += '</div><div class="ui-block-b" >';
                        html += '<a href="javascript:void(0);" data-role="button" onclick="branchICDGuide(\''+ newContainerID + '\',' + (currentWFC + 1) + ',' + branchIds[1] + ',-1);">' + branchLabels[1] + '</a>';
                        html += '</div></div>';
                        break;
                    case 3:
                        html += '<div class="ui-grid-b"><div class="ui-block-a" >';
                        html += '<a href="javascript:void(0);" data-role="button" onclick="branchICDGuide(\''+ newContainerID + '\',' + (currentWFC + 1) + ',' + branchIds[0] + ',1);">' + branchLabels[0] + '</a>';
                        html += '</div><div class="ui-block-b" >';
                        html += '<a href="javascript:void(0);" data-role="button" onclick="branchICDGuide(\''+ newContainerID + '\',' + (currentWFC + 1) + ',' + branchIds[1] + ',0);">' + branchLabels[1] + '</a>';
                        html += '</div><div class="ui-block-c" >';
                        html += '<a href="javascript:void(0);" data-role="button" onclick="branchICDGuide(\''+ newContainerID + '\',' + (currentWFC + 1) + ',' + branchIds[1] + ',-1);">' + branchLabels[2] + '</a>';
                        html += '</div></div>';
                        break;
                } 
                
            } else {
                var cList = getCodeList(codeList, codeListId);
                if(cList) {
                    html += '<div data-role="fieldcontain" id="' + codeListId + '" >';//newContainerID + '\',' + (currentWFC + 1) + ',' + branchIds[1] + ',0);">' + branchLabels[1]
                    if(cList.listType == 'multi') {
                        html += createMultiSelectCode(newContainerID,(currentWFC + 1), branchIds[0], 0 ,cList ,codes);
                        html += '<a href="javascript:void(0);" onclick="branchICDGuide(\''+ newContainerID + '\',' + (currentWFC + 1) + ',' + branchIds[0] + ',0);" data-role="button" data-theme="b" >' + branchLabels[0] + '</a>';
                    } else {
                        html += createSingleSelectCode(newContainerID,(currentWFC + 1), branchIds[0], 0 ,cList ,codes);
                    }
                
                    html += '</div>\n';
                } else {
                    $('#cmdSendMessage').show('fade');
                }
            }
            html += '</div>';

            var position = $('#guideSteps').html(html).trigger('create').fadeIn().position();
            if(currentStep == 2 || currentStep == 102) {//Vcode Calculator
                addCode(new ICDCode(0, 'V15.52_B', 'Unknown if injury related to global war on terrorism, unknown level of severity'));
            }
            if(nextPiece) {
                currentWFC++;
                currentStep++;
            }
            if(position != null) {
                $.mobile.silentScroll(position.top - 200);
            }
            var codingResults = $('#codingResults');
            if(codingResults.html() == '') {
                $('#codingResultsDiv').hide('fade');
            } else {
                $('#codingResultsDiv').show('fade');
            }
        }
        currentIndex++;
    });
}

function addCode(code){
    var clone = $('<div class="mtbi-coding"><span class="mtbi-codes">' + code.code + '</span><span class="mtbi-codeDesc">' + code.codeDescription + '</span><div>');
    clone.appendTo('#codingResults').trigger('create').show('fade');
}

function toggleCode(code) {
    var existed = false;
    $('#codingResults div').each(function(){
        if($('span.mtbi-codes',$(this)).html() == code.code) {
            existed = true;
            $(this).remove();
        }
    });
    if(!existed) addCode(code);
}

function removeCode(code) {
    $('#codingResults div').each(function(){
        if($('span.mtbi-codes',$(this)).html() == code.code) {
            $(this).remove();
            return;
        }
    });
}
function branchICDGuide(target, workflowCount, step, positiveOrNeg) {
    var position = $('#guideSteps').html('').trigger('refresh').hide('fade');
    parseICDflow(xmlWorkFlow, workflowCount, step, positiveOrNeg);
}


function parseWorkflow(xmlData, workflowCount, stepIndex, positiveOrNeg) {
    var currentIndex = 0;
    var nextPiece = false;
    var currentStep = stepIndex;
    var currentWFC = workflowCount;
    $('step',xmlData).each(function(){
        if(currentStep == currentIndex){
            var posStepID = $(this).attr('positiveStepId'),
            negStepID = $(this).attr('negativeStepId'),
            neutStepID = $(this).attr('neutralStepId'),
            stepTitle = $(this).find('title').text(),
            stepContent = $(this).find('content').text(),
            stepDetailedContent = $(this).find('detailedContent').text(),
            newContainerID = 'stepDiv'+currentWFC;
            $('#algorithmSteps').append ('<div id="' + newContainerID + '" style="display:none;"></div>');
            var html = '';
            if(currentWFC > 0) {
                switch(positiveOrNeg) {
                    case -1:
                        html += '<div class="arrowDownRight"></div>';
                        break;
                    case 0:
                        html += '<div class="arrowDownMiddle"></div>';
                        break;
                    case 1:
                        html += '<div class="arrowDownLeft"></div>';
                        break;
                }
            } 
            html += '<div class="mtbi-outer-rounded" data-theme="b"">';
            if(stepTitle != '') html += '<h4>' + stepTitle + '</h4>';
            if(stepContent != '') html +='<div>' + stepContent + '</div>';
            if(stepDetailedContent != '') html +='<div>' + stepDetailedContent + '</div>';
            if(neutStepID > 0){
                html += '<a href="javascript:void(0);" onclick="makeDecision(\''+ newContainerID + '\',' + (currentWFC + 1) + ',' + neutStepID + ',0);" data-role="button" data-theme="b" >Next</a>';
            } else if (posStepID > 0) {
                html += '<div class="ui-grid-a"><div class="ui-block-a" >';
                html += '<a href="javascript:void(0);" data-role="button" onclick="makeDecision(\''+ newContainerID + '\',' + (currentWFC + 1) + ',' + posStepID + ',1);">Yes</a>';
                html += '</div><div class="ui-block-b" >';
                html += '<a href="javascript:void(0);" data-role="button" onclick="makeDecision(\''+ newContainerID + '\',' + (currentWFC + 1) + ',' + negStepID + ',-1);">No</a>';
                html += '</div></div>';
            } else {
                nextPiece = true;
            }
            html += '</div>';
            var position = $('#' + newContainerID).html(html).trigger('create').fadeIn().position();
            if(nextPiece) {
                currentWFC++;
                currentStep++;
            } else {
                $.mobile.silentScroll(position.top);
            }
        }
        currentIndex++;
    });
}

function makeDecision(target, workflowCount, step, positiveOrNeg) {
    removeSiblings(target);
    parseWorkflow(xmlWorkFlow, workflowCount, step, positiveOrNeg);
}

function adjustHistory() {
    historyCount--;
    console.log("historyCount = " + historyCount);
}


function goHome() {
    console.log("go(" + historyCount + ")");
    history.go(historyCount);
    historyCount = 0;
}


/************
 * V Code Calculator
 */

function calcVCode() {
    var result = '';
    var history = $('#history').val() == 'on';
    var injured = $('#select-related').val();
    var severity = $('#select-severity').val();
    var codeDesc = '';
    if(history){
        codeDesc = 'Personal history of traumatic brain injury NOT otherwise specified'
        result = "V15.52_0";
        $('#select-related').selectmenu('disable');
        $('#select-severity').selectmenu('disable');
    } else {
        $('#select-related').selectmenu('enable');
        $('#select-severity').selectmenu('enable');
        result = 'V15.52_';
        if(injured == 'yes') {
            codeDesc = 'Injury related to global war on terorism';
            switch(severity) {
                case 'unknown':
                    result += 1;
                    break;
                case 'mild':
                    result += 2;
                    break;
                case 'moderate':
                    result += 3;
                    break;
                case 'severe':
                    result += 4;
                    break;
                case 'penetrating':
                    result += 5;
                    break;
            }
        } else if(injured == 'no') {
            codeDesc = 'Injury is not related to global war on terrorism';
            switch(severity) {
                case 'unknown':
                    result += 6;
                    break;
                case 'mild':
                    result += 7;
                    break;
                case 'moderate':
                    result += 8;
                    break;
                case 'severe':
                    result += 9;
                    break;
                case 'penetrating':
                    result += 'A';
                    break;
            }
            
        } else if(injured == 'unknown') {
            codeDesc = 'Unknown if injury related to global war on terrorism';
            switch(severity) {
                case 'unknown':
                    result += 'B';
                    break;
                case 'mild':
                    result += 'C';
                    break;
                case 'moderate':
                    result += 'D';
                    break;
                case 'severe':
                    result += 'E';
                    break;
                case 'penetrating':
                    result += 'F';
                    break;
            }
            
        }
        codeDesc += ', ' + severity + ' level of severity';
    }
    var code = new ICDCode(0, result, codeDesc);
    removeCode(new ICDCode(0, $('#vcode').val(), codeDesc));
    addCode(code);
    $('#vcode').val(result);
}
function testLocalStorage(){
    var result = false;
    if (typeof(localStorage) == 'undefined' ) {
        console.log('Your browser does not support HTML5 localStorage. Try upgrading.');
    } else {
        console.log('Your browser supports HTML5 localStorage.');
        try {
            localStorage.setItem("name", "Hello World!"); //saves to the database, "key", "value"
            result = true;
        } catch (e) {
            console.log(e);
            if (e == QUOTA_EXCEEDED_ERR) {
                console.log('Quota exceeded!'); //data wasn't successfully saved due to quota exceed so throw an error
            }
        }
        localStorage.removeItem("name"); //deletes the matching item from the database
    }
    return result;
}

function removeKey(key) {
    localStorage.removeItem(key);
}
function getKeyValue(key) {
    //console.log('Getting '+key);
    return localStorage.getItem(key);
}
function saveKeyValue(key, value) {
    //console.log('Saving '+key + ' to ' + value);
    try {
        localStorage.setItem(key, value); //saves to the database, "key", "value"
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
            console.log('Quota exceeded!'); //data wasn't successfully saved due to quota exceed so throw an error
        }
    }
}
/* Attempt at blocking consecutive taps
var blockTaps = false;
$('a').live('vclick',function(event, ui){
   //console.log('vclick '+blockTaps);
   if(!blockTaps){
       blockTaps = true;
       return true;
   }
   return !blockTaps; 
});
$('div').live('pagebeforehide',function(event, ui){
    if(!blockTaps){
        //console.log('blocking taps');
        blockTaps = true;
        setTimeout('blockTaps=false;',1000);
    }
    //console.log('pagebeforehide');
});
$('div').live('pagebeforeshow',function(event, ui){
    $('ul', $.mobile.activePage).each(function(){
       $('li').each(function(){
           //console.log(this.className);
       }); 
    });
    //console.log('beforepageshow');
});
 */
$('div').live('pageshow',function(event, ui){
    logPageChange();
    adjustHistory();
    //console.log('unblocking taps')
    blockTaps = false
});


$('#mainPage').live('pageshow',function(event, ui){
    historyCount = 0;
    //console.log("historyCount = " + historyCount);
});


$('#algorithmAPage').live('pageshow',function(event, ui){
    loadAWorkflow('workflowA.xml');
});

$('#algorithmBPage').live('pageshow',function(event, ui){
    loadBWorkflow('workflowB.xml');
});

$('#algorithmCPage').live('pageshow',function(event, ui){
    loadCWorkflow('workflowC.xml');
});
$('#codingWizardPage').live('pageshow',function(event, ui){
    loadICDWizard('icdwizard.xml');
});
$('#neckPage').live('pageshow',function(event, ui){
    loadNeck('neck_stretches.xml');
});
$('#vestibularPage').live('pageshow',function(event, ui){
    loadVestibular('vestibular_exercises.xml');
});
$('#rehabPage').live('pageshow',function(event, ui){
    loadVestibular('cognitive_rehab_workflow.xml');
});
$('#icdVCodes').live('pageshow',function(event, ui){
    calcVCode();
});
$('#toolPHQ9').live('pageshow',function(event, ui){
    currentTool = 'phq9';
    loadQuestions('phq9.xml');
});
$('#toolDHI').live('pageshow',function(event, ui){
    currentTool = 'dhi';
    loadQuestions('dhi.xml');
});
$('#toolESS').live('pageshow',function(event, ui){
    currentTool = 'ess';
    loadQuestions('ess.xml');
});
$('#toolGCS').live('pageshow',function(event, ui){
    currentTool = 'gcs';
    loadQuestions('gcs.xml');
});
$('#toolNSI').live('pageshow',function(event, ui){
    currentTool = 'nsi';
    loadQuestions('nsi.xml');
});
$('#toolPCLM').live('pageshow',function(event, ui){
    currentTool = 'pclm';
    loadQuestions('pclm.xml');
});
$('#toolMAF').live('pageshow',function(event, ui){
    currentTool = 'maf';
    loadQuestions('maf.xml');
});

//collapse page navs after use
$(function(){
    $('body').delegate('.content-secondary .ui-collapsible-content', 'click',  function(){
        $(this).trigger("collapse")
    });
});
function logPageChange(){
    logAnalytics('Page: '+ getCurrentPage());
}

function getCurrentPage() {
    var base = 'www';
    var result = '';
    if(location.hash) 
        result = location.hash.substring(1);
    else 
        result = location.pathname;
    var path = $.mobile.path.parseUrl(result).pathname;
    var indexPosition = path.indexOf(base);
    if(indexPosition > -1)
        path = path.substring(path.indexOf(base)+base.length+1);
    indexPosition = path.indexOf('&');
    if(indexPosition > -1) {
        var bar = $('.ui-header', $.mobile.activePage);
        var subPage = 'Nested-List ' + $('.ui-title', bar).html();
        path = path.substring(0,indexPosition) + ' ' + subPage;
    }
    return path;
}
function setDefaultTransition(){
    var winwidth = $( window ).width(),
    trans ="fade";
		
    if( winwidth >= 2000 ){
        trans = "none";
    }
    else if( winwidth >= 650 ){
        trans = "fade";
    }

    $.mobile.defaultPageTransition = trans;
}

function mailCodes(){
    var body = '';
    $('#codingResults div.mtbi-coding').each(function(){
        var separater = '';
        $('span',this).each(function(){
            body += separater + $(this).html();
            separater = ': ';
        })
        body += '\n';
    });
    body = encodeURIComponent(body);
    window.location.href = 'mailto:?subject=ICD-9%20Codes&body=' + body;
}

$(function(){
    setDefaultTransition();
    $( window ).bind( "throttledresize", setDefaultTransition );
});

