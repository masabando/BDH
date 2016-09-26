
function bdh() {
  var APP_NAME = 'bdh.js';
  var VERSION = "0.2";

  var content = $('#BDH');
  var question_container = $('#question_container')
  var textline = $('#textline');
  var numline = $('#numline');
  var answer_container = $('#answer_container')
  var answer_input = $('#answer_input');
  var answer_output = $('#answer_output');
  var next_button = $('#next_button');
  var footer = $('#footer');
  var header = $('#header');
  var base_a = [2, 10, 16];
  var digit_size = 8;// 4*N
  var digit_msize = 4;// 4*M < digit_size

  // [Autoset Vars] ---------------------------------------------------
  var click_event = 'click';
  var smart_phone_flag = false;
  var num_range = {max: Math.pow(2,digit_size - 1) - 1,
                   min: -Math.pow(2,digit_size - 1)};
  var zfillstr = Array(digit_size + 1).join("0");
  var answer;
  // [for smart phone] ------------------------------------------------
  function agent_checker() {
    var agent = navigator.userAgent;
    if(agent.search(/iPhone/) != -1 || agent.search(/iPad/) != -1
       || agent.search(/iPod/) != -1 || agent.search(/Android/) != -1) {
      smart_phone_flag = true;
      click_event = "touchend";
      // $(window).on('touchmove', function(e) { e.preventDefault(); });
    }
  }
  // ------------------------------------------------------------------

  function get_rand(min, max) {
    return Math.floor((max - min + 1)*Math.random() + min);
  }

  function zerofill(str, base) {
    return (zfillstr + str).slice(base == 2 ? -8 : -2);
  }

  function bitflip(str) {
    return $.map(str.split(""), function(v, i) {
      if (i == 4) { return v; }
      return parseInt(v) == 0 ? "1" : "0";
    }).join("");
  }

  function add1(str) {
    var a = zerofill((parseInt(str.substr(0,4) + str.substr(5,4), 2) + 1)
                     .toString(2), 2);
    var b = str.charAt(4);
    return a.substr(0,4) + b + a.substr(4,4)
  }

  function get_random_bin(intflag) {
    var a = Array.apply(null, Array(digit_size))
      .map(function() { return get_rand(0,1); });
    a.splice(4, 0, intflag === 1 ? " " : ".");
    return a.join("");
  }


  function bin2hex(s) {
    return parseInt(s.substr(0, 4), 2).toString(16)
      + (s.charAt(4) === " " ? "" : ".")
      + parseInt(s.substr(5, 4), 2).toString(16);
  }

  function bin2dec(s) {
    if (s.charAt(4) === " ") {// 整数
      if (parseInt(s.charAt(0)) == 0) {// 正の整数
        return parseInt(s.substr(0, 4) + s.substr(5, 4), 2).toString(10);
      } else {// 負の整数
        b = add1(bitflip(s));
        return (-parseInt(b.substr(0, 4) + b.substr(5, 4), 2)).toString(10);
      }
    } else {// 小数
      if (parseInt(s.charAt(0)) == 0) {// 正の小数
        return (parseInt(s.substr(0, 4), 2)
                + parseInt(s.substr(5, 4), 2)*Math.pow(0.5, 4)).toString(10);
      } else {// 負の小数
        var b = add1(bitflip(s));
        return (-(parseInt(b.substr(0, 4), 2)
                  + parseInt(b.substr(5, 4), 2)*Math.pow(0.5, 4))).toString(10);
      }
    }
  }

  function add_hook_buttons() {
    $('#submit_button').on(click_event, function() {
      var ans = answer;
      if (ans.length == 9 && ans.charAt(4) === ' ') {
        ans = answer.substr(0,4) + answer.substr(5,4);
      }
      answer_output.html(
        ((answer_input.val() === answer || answer_input.val() === ans)
         ? '<span class="seikai">正解</span>'
         : '<span class="huseikai">不正解</span>')
          + "<br>正解は " + answer + " です。"
      );
      answer_output.css("visibility", "visible");
      next_button.css("visibility", "visible");
    });
    next_button.on(click_event, function() {
      question();
    });
  }


  function question() {
    var iflag = get_rand(0,1);
    var qstr = get_random_bin(iflag);
    var from_i = get_rand(0,2);
    var from_base = base_a[from_i];
    var to_base = base_a[(from_i + get_rand(1,2)) % 3];
    var from_x;
    answer_input.val("");
    answer_output.css("visibility", "hidden");
    next_button.css("visibility", "hidden");
    switch(from_base) {
    case 2: from_x = qstr; break;
    case 10: from_x = bin2dec(qstr); break;
    case 16: from_x = bin2hex(qstr); break;
    }
    switch(to_base) {
    case 2: answer = qstr; break;
    case 10: answer = bin2dec(qstr); break;
    case 16: answer = bin2hex(qstr); break;
    }
    textline.html(
      iflag === 1 ? "負数を2の補数で表す8ビットの整数において、"
        : ("負数を2の補数で表す8ビットの小数<br>"
           + "(固定小数点、小数点は4ビット目と5ビット目の間)において、")
    );
    numline.html(
      from_base + "進数の " + from_x + " を、" + to_base + "進数に変換せよ。"
      + "<br>半角の小文字で答えること。"
    );
  }

  function init() {
    agent_checker();
    footer.html(APP_NAME + " -- v." + VERSION)
    add_hook_buttons();
  }

  function go() {
    init();
    question();
  }

  go();
}


$(function() {
  bdh();
});
