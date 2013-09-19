// debug shortcut
function debug(x) {
    console.log(x);
}

// make a random id
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i=0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// evaluate if a number
function isNumeric(num) {
    return !isNaN(num);
}

// true number conversion
function toNumber(num) {
    num = String(num);
    var number = num.replace(/[^0-9\.\-]+/g, '');
    if (number == '') {
        number = 0;
    }
    return isNumeric(number) ? parseFloat(number) : 0;
}

// remove quotes from a string
function removeQuotes(str) { 
    return (str = str.replace(/["]{1}/gi,""));
}

// add quotes to a string
function addQuotes(str) {
    // check first character
    if ((str.indexOf('"') == 0) || (str.indexOf("'") == 0)) {
        // make sure it is a double quote
        str.replace("'", '"');
    } else {
        // quote it
        str = '"' + str;
    }
    // check last character
    if ((str.slice(-1) == '"') || (str.slice(-1) == "'")) {
        // make sure it is a double quote
        str.replace(/'$/, '"');
    } else {
        // quote it
        str = str + '"';
    }
    return str;
}

// print results
function printStack(stack, clear) {
    // show our results container
    $('#resultsContainer').removeClass('hidden');
    // get our stack results container
    var $results = $('#stackResults');
    // clear our results column
    if (clear != undefined) {
        if (clear == true) {
            $results.html('');
        }
    }
    // format our stack
    if (stack instanceof Array) {
        var stackString = stack.join(' ');
    } else {
        var stackString = stack;
    }
    // print our stack
    $results.append('<pre>' + stackString + '</pre>');
}

// print error
function printError(errorText) {
    // show our results container
    $('#resultsContainer').removeClass('hidden');
    // get our stack results container
    var $results = $('#stackResults');
    // print our error
    $results.append('<pre class="text-danger"><strong>ERROR: ' + errorText + '</strong></pre>');
}

// clean the stack
function cleanStack(stack) {
    var clean_stack = [];
    $.each(stack, function(index, value){
        // make numbers numbers
        if (isNumeric(value)) {
            // remove nulls
            if (value != null) {
                // push it
                clean_stack.push(parseFloat(value));
            }
        } else {
            // push it
            clean_stack.push(value);
        }
    });
    return clean_stack;
}

// clear history
function clearHistory() {
    $('#stackHistory pre').remove();
}

// print history
function printHistory(history, value) {
    // get our stack history container
    var $results = $('#stackHistory');
    // format our stack history
    if (history instanceof Array) {
        var historyString = history.join(' ');
    } else {
        var historyString = history;
    }
    // format our stack value
    if (value instanceof Array) {
        var valueString = value.join(' ');
    } else {
        var valueString = value;
    }
    // print our stack
    $results.prepend('<pre><em class="text-primary">' + historyString + '</em> &nbsp;&raquo;&nbsp; <strong class="text-success">' + valueString +'</strong></pre>');
}

// remove items from an array
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

// round to the nearest multiple
Number.prototype.roundTo = function(num) {
    var resto = this%num;
    if (resto <= (num/2)) { 
        return this-resto;
    } else {
        return this+num-resto;
    }
}

// replace items in stack
function replace(stack, start, end, result) {
    // remove the old values
    stack.remove(start, end);
    if (result != '#*#') {
        // add the result
        stack.splice(start, 0, result);
    }
    return stack;
}

// regex escape
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

// run stack processing
function run() {
    // grab our stack
    var input_value = $('#e130Input').val();
    // make sure we are not empty
    if (input_value != '') {

        // print initial stack to show were we start
        printStack(input_value, true);

        // substitute each of our custom tags
        var replace_tag = false;
        $('#customTags .btn-reference').each(function(){
            var id = $(this).data('id');
            var tag = $(this).data('insert');
            var value = $('input[data-id="'+id+'"]').val();
            re_tag = escapeRegExp(tag);
            var re = new RegExp(re_tag, 'g');
            input_value = input_value.replace(re, value);
            if (input_value.indexOf(tag) != -1) {
                replace_tag = true;
            }
        });

        // print the search/replaced stack
        if (replace_tag) {
            printStack(input_value);
        }

        // parse input_value to create stack
        var stack = input_value.match(/(\w|\+|\-|\*|\/|\&|\<|\>|\!|\?|\||\=|\.|\'|\:|\/|\$)+|"[^"]+"/g);
        // evaluate the stack
        result = evaluate(stack);

        // print our history
        printHistory(input_value, result);
    }
}

// evaluage the E130 tag
function evaluate(stack) {

    // error
    var error = false;
    var errorText = '';

    // loop through each item in the stack
    $.each(stack, function(index, value){

        // evaluate at the end?
        var eval = true;
        var eval_index = 2;
        var temp_stack = stack;

        // temp value
        var temp = '#*#';

        // process our 
        switch(value) {
            
            // addition
            case '+':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "+"'; return false; }
                temp = toNumber(stack[index-2]) + toNumber(stack[index-1]);
                break;
            
            // subtraction
            case '-':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "-"'; return false; }
                temp = toNumber(stack[index-2]) - toNumber(stack[index-1]);
                break;
            
            // multiplication
            case '*':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "*"'; return false; }
                temp = toNumber(stack[index-2]) * toNumber(stack[index-1]);
                break;

            // division
            case '/':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "/"'; return false; }
                temp = toNumber(stack[index-2]) / toNumber(stack[index-1]);
                break;

            // equals comparison
            case '==':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "=="'; return false; }
                temp = ((isNumeric(stack[index-2]) ? parseFloat(stack[index-2]) : 0) == (isNumeric(stack[index-1]) ? parseFloat(stack[index-1]) : 0)) ? 1 : 0;
                break;

            // previous two values are true (1 && 1)
            case '&&':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "&&"'; return false; }
                a = (isNumeric(stack[index-2]) ? parseFloat(stack[index-2]) : 0) == 1;
                b = (isNumeric(stack[index-1]) ? parseFloat(stack[index-1]) : 0) == 1;
                temp = ((a == true) && (b == true)) ? 1 : 0;
                break;

            // previous two values are true (1 || 1)
            case '||':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "||"'; return false; }
                a = (isNumeric(stack[index-2]) ? parseFloat(stack[index-2]) : 0) == 1;
                b = (isNumeric(stack[index-1]) ? parseFloat(stack[index-1]) : 0) == 1;
                temp = ((a == true) || (b == true)) ? 1 : 0;
                break;

            // ternary if
            case '?':
                if (index < 3) { error = true; errorText = 'Insufficient arguments near "?"'; return false; }
                if ((isNumeric(stack[index-3]) ? parseFloat(stack[index-3]) : 0) == 1) {
                    temp = stack[index-2];
                } else {
                    temp = stack[index-1];
                }
                eval_index = 3;
                break;

            // less than comparison
            case '<':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "<"'; return false; }
                temp = ((isNumeric(stack[index-2]) ? parseFloat(stack[index-2]) : 0) < (isNumeric(stack[index-1]) ? parseFloat(stack[index-1]) : 0)) ? 1 : 0;
                break;

            // greater than comparison
            case '>':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near ">"'; return false; }
                temp = ((isNumeric(stack[index-2]) ? parseFloat(stack[index-2]) : 0) > (isNumeric(stack[index-1]) ? parseFloat(stack[index-1]) : 0)) ? 1 : 0;
                break;

            // not (invert 0|1)
            case '!':
                if (index < 1) { error = true; errorText = 'Insufficient arguments near "!"'; return false; }
                temp = (parseFloat(stack[index-1]) == 0) ? 1 : 0;
                eval_index = 1;
                break;

            // length of values
            case 'length':
                if (index < 1) { error = true; errorText = 'Insufficient arguments near "length"'; return false; }
                temp = removeQuotes(stack[index-1]).length;
                eval_index = 1;
                break;

            // convert to integer
            case 'int':
                if (index < 1) { error = true; errorText = 'Insufficient arguments near "int"'; return false; }
                temp_number = toNumber(stack[index-1]);
                temp = Math.round(isNumeric(temp_number) ? parseFloat(temp_number) : 0);
                eval_index = 1;
                break;

            // concatenates previous two values
            case 'concat':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "concat"'; return false; }
                temp = removeQuotes(String(stack[index-2])) + removeQuotes(String(stack[index-1]));
                break;

            // index of
            case 'indexof':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "indexof"'; return false; }
                temp = removeQuotes(String(stack[index-2])).indexOf(removeQuotes(String(stack[index-1])));
                break;

            // next index of
            case 'nextindexof':
                if (index < 3) { error = true; errorText = 'Insufficient arguments near "nextindexof"'; return false; }
                temp = removeQuotes(String(stack[index-3])).indexOf(removeQuotes(String(stack[index-2])), stack[index-1]);
                eval_index = 3;
                break;

            // last index of
            case 'lastindexof':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "lastindexof"'; return false; }
                temp = removeQuotes(String(stack[index-2])).lastIndexOf(removeQuotes(String(stack[index-1])));
                break;

            // replaces all values
            case 'replaceall':
                if (index < 3) { error = true; errorText = 'Insufficient arguments near "replaceall"'; return false; }
                var re = new RegExp(removeQuotes(String(stack[index-2])), 'g');
                temp = addQuotes(removeQuotes(String(stack[index-3])).replace(re, removeQuotes(String(stack[index-1]))));
                eval_index = 3;
                break;

            // pop
            case 'pop':
                if (index < 1) { error = true; errorText = 'Insufficient arguments near "pop"'; return false; }
                eval_index = 1;
                break;

            // duplicate
            case 'dup':
                if (index < 1) { error = true; errorText = 'Insufficient arguments near "dup"'; return false; }
                temp = stack[index-1];
                eval_index = 0;
                break;

            // swap
            case 'swap':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "swap"'; return false; }
                temp_stack = stack;
                // swap them
                var b = temp_stack[index-1];
                temp_stack[index-1] = temp_stack[index-2]
                temp_stack[index-2] = b;
                // remove our swap value
                temp_stack.splice(index, 1);
                // print our results to see what we are doing
                printStack(temp_stack);
                // evaluate our new stack
                stack = evaluate(temp_stack);
                // don't evaluate this level
                eval = false;
                break;

            // print the stack... to the stack
            // TODO: multiple print stacks?
            case 'printstack':
                temp_stack = [];
                // remove our printstack value
                stack.splice(index, 1);
                string_stack = '[';
                printStackFound = false;
                $.each(stack, function(index, value){
                    if (value == "printstack" && printStackFound == false) {
                        printStackFound = true;
                    } else {
                        temp_stack.push(value);
                        string_stack = string_stack + '"' + value + '",';
                    }
                });
                // remove last comma
                string_stack = string_stack.substring(0, string_stack.length - 1);
                // close it
                string_stack = string_stack + ']';
                // print our results to see what we are doing
                printStack(string_stack);
                // evaluate our new stack
                stack = evaluate(temp_stack);
                // don't continue
                eval = false;
                break;

            // max
            case 'max':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "max"'; return false; }
                temp = (toNumber(stack[index-1]) > toNumber(stack[index-2])) ? toNumber(stack[index-1]) : toNumber(stack[index-2]);
                break;

            // min
            case 'min':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "min"'; return false; }
                temp = (toNumber(stack[index-1]) < toNumber(stack[index-2])) ? toNumber(stack[index-1]) : toNumber(stack[index-2]);
                break;

            // roundmult
            case 'roundmult':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "roundmult"'; return false; }
                temp = toNumber(stack[index-2]).roundTo(toNumber(stack[index-1]));
                break;

            // stack count
            case 'stackcount':
                temp = stack.length - 1;
                eval_index = stack.length - 1;
                break;

            // string count
            case 'stringcount':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "stringcount"'; return false; }
                var needle = new RegExp(removeQuotes(String(stack[index-1])), 'g');
                var haystack = stack[index-2];
                count = haystack.match(needle);
                if (count == null) {
                    temp = 0;
                } else {
                    temp = count.length;
                }
                break;

            // convert to number
            case 'number':
                if (index < 1) { error = true; errorText = 'Insufficient arguments near "number"'; return false; }
                temp = toNumber(stack[index-1]);
                eval_index = 1;
                break;

            // convert to string
            case 'string':
                if (index < 1) { error = true; errorText = 'Insufficient arguments near "string"'; return false; }
                temp = addQuotes(String(stack[index-1]));
                eval_index = 1;
                break;

            // substring
            case 'substring':
                if (index < 3) { error = true; errorText = 'Insufficient arguments near "substring"'; return false; }
                // wrap in quotes
                temp_string = addQuotes(stack[index-3]);
                // sub it, returning a quoted string
                temp = addQuotes(temp_string.slice(toNumber(stack[index-2])+1, toNumber(stack[index-1])+1));
                eval_index = 3;
                break;

            // compare
            case 'compare':
                if (index < 2) { error = true; errorText = 'Insufficient arguments near "compare"'; return false; }
                a = removeQuotes(String(stack[index-2]));
                b = removeQuotes(String(stack[index-1]));
                temp = a.charCodeAt(0) - b.charCodeAt(0);
                break;

            // convert to US currency
            case 'currency':
                if (index < 1) { error = true; errorText = 'Insufficient arguments near "currency"'; return false; }
                var number = removeQuotes(String(stack[index-1]));
                dollars = number.split('.')[0];
                cents = (number.split('.')[1] || '') + '00';
                cents = parseFloat('.' + cents);
                cents = String(cents.toFixed(2));
                cents = cents.substring(1);
                dollars = dollars.split('').reverse().join('').replace(/(\d{3}(?!$))/g, '$1,').split('').reverse().join('');
                temp = addQuotes('$' + dollars + cents);
                eval_index = 1;
                break;

            // help
            case 'help':
                temp = "PC LOAD LETTER";
                eval_index = stack.length - 1;
                break;

            // do nothing, pass
            default:
                eval = false;

        }

        // do we want to evaluate our new stack?
        if (eval == true) {

            // replace the stack items with the result value and evaluate
            temp_stack = replace(stack, (index - eval_index), index, temp);

            // print our results to see what we are doing
            printStack(temp_stack);
            
            // evaluate our new stack
            stack = evaluate(temp_stack);
        }

    });
    
    // if we have an error
    if (error) {
        printError(errorText);
    }

    return stack;
}

// hi mom
$(document).ready(function($) {

    // run on click
    $('#e130Evaluate').on('click', function(){
        run();
    });

    // run on submit
    $('#e130Form').on('submit', function(e){
        e.preventDefault();
        run();
    });

    // insert reference buttons
    $('#customTags, #reference').on('click', '.btn-reference', function(){
        $('#e130Input').val($('#e130Input').val() + ' ' + $(this).data('insert'));
    });

    // insert examples
    $('.btn-example').on('click', function(){
        $('#e130Input').val($(this).data('example'));
        $('#e130Evaluate').click();
    });

    // add a new tag
    $('#addLuminateTag').on('click', function(){
        var tag = $('#luminateTag').val();
        var id = 'tag' + makeid();
        var html = '<div id="'+id+'" class="input-group" style="margin-bottom: 5px;"> \
                        <span class="input-group-btn"> \
                            <button data-id="'+id+'" class="btn btn-primary btn-small btn-reference" type="button" data-insert="'+tag+'">'+tag+'</button> \
                        </span> \
                        <input data-id="'+id+'" type="text" class="form-control input-small"> \
                        <span class="input-group-btn"> \
                            <button class="btn btn-info btn-small remove-tag" type="button" data-id="'+id+'">&times;</button> \
                        </span> \
                    </div>';
        $('#customTags').append(html);
        $('#luminateTag').val('');
    });

    // clear history
    $('#clearExpressionHistory').on('click', function(){
        clearHistory();
    });

    // remove custom tag
    $('#customTags').on('click', '.remove-tag', function(){
        $(this).closest('.input-group').remove();
    });

    // run first expression as an example
    $('#e130Evaluate').click();

});



// complete
// [x] - <              2   com.convio.evaluate.rpn.NumericLessThan
// [x] - int            1   com.convio.evaluate.rpn.IntCast
// [?] - copy           1   com.convio.evaluate.rpn.Copy
// [x] - &&             2   com.convio.evaluate.rpn.And
// [x] - printstack     0   com.convio.evaluate.rpn.PrintStack
// [x] - concat         2   com.convio.evaluate.rpn.Concat
// [x] - nextindexof    3   com.convio.evaluate.rpn.NextIndexOf
// [x] - /              2   com.convio.evaluate.rpn.Divide
// [x] - -              2   com.convio.evaluate.rpn.Subtract
// [x] - replaceall     3   com.convio.evaluate.rpn.StringReplace
// [x] - pop            1   com.convio.evaluate.rpn.Pop
// [x] - dup            1   com.convio.evaluate.rpn.Duplicate
// [x] - +              2   com.convio.evaluate.rpn.Add
// [x] - currency       1   com.convio.evaluate.rpn.Currency
// [x] - *              2   com.convio.evaluate.rpn.Multiply
// [x] - stringcount    2   com.convio.evaluate.rpn.StringCount
// [x] - number         1   com.convio.evaluate.rpn.NumberCast
// [x] - lastindexof    2   com.convio.evaluate.rpn.LastIndexOf
// [x] - roundmult      2   com.convio.evaluate.rpn.RoundMult
// [x] - length         1   com.convio.evaluate.rpn.Length
// [x] - !              1   com.convio.evaluate.rpn.Not
// [x] - substring      3   com.convio.evaluate.rpn.Substring
// [x] - max            2   com.convio.evaluate.rpn.Maximum
// [x] - indexof        2   com.convio.evaluate.rpn.IndexOf
// [x] - stackcount     0   com.convio.evaluate.rpn.StackCount
// [x] - min            2   com.convio.evaluate.rpn.Minimum
// [x] - string         1   com.convio.evaluate.rpn.StringCast
// [x] - swap           2   com.convio.evaluate.rpn.Swap
// [x] - compare        2   com.convio.evaluate.rpn.Compare
// [x] - help           0   com.convio.evaluate.rpn.Help
// [?] - print          1   com.convio.evaluate.rpn.Print
// [x] - ||             2   com.convio.evaluate.rpn.Or
// [x] - ?              3   com.convio.evaluate.rpn.TernaryIf
// [x] - >              2   com.convio.evaluate.rpn.NumericGreaterThan
// [x] - ==             2   com.convio.evaluate.rpn.NumericEquals