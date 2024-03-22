$(function () {

  $('#action_menu_btn').on("click", function () {
    $('.action_menu').toggle();
  });


  var $chatBox = $(".card-body");
  var $messageInput = $("#message-input");
  var $sendButton = $("#send-button");
  var $icon = $('#onlineStatus');
  var $block = $('#block');
  var $checkOnline = $('#checkOnline');


  // 调整页面高度
  adjustDivHeight();

  // 监听窗口大小变化以重新计算[card]的显示高度
  window.addEventListener('resize', adjustDivHeight);
  // 调整页面高度的函数
  function adjustDivHeight() {
    var $card = $(".card");
    var screenHeight = window.innerHeight;          // 获取屏幕高度
    var contentHeight = document.body.scrollHeight; // 获取页面内容高度
    $card.height(620);
  }

  $messageInput.on('focusin focusout', function (event) {
    if (event.type === 'focusin') {
      // 保存当前滚动位置
      //originalScrollTop = $(window).scrollTop();
      // 执行输入法面板弹出时的操作
    } else {
      // 执行输入法面板隐藏时的操作
      $('html, body').animate({ scrollTop: 0 }, 80);
      adjustDivHeight();
    }
  });

  // 按键触发监听
  $messageInput.on("keypress", function (event) {
    if (event.key === "Enter") {
      $sendButton.trigger('click');
      event.preventDefault();
    }
  });

  // 监听移动设备键盘弹出事件
  window.addEventListener('resize', function () {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
      // 在输入状态时调整 div 高度
      adjustDivHeight();
    }
  });

  // 阻止浏览器默认的下拉刷新行为
  document.addEventListener('touchmove', function (event) {
    event.preventDefault();
  }, { passive: false });

  // 停止打印文字信息
  $("body").on("click", "span.noPrint", function () {
    printIsStop = true;
  });

  $sendButton.on("click", function () {

    if ($icon.hasClass('offline')) {
      alert("Tommy 不在线，请稍等.");
      return;
    }

    var message = $messageInput.val().trim();

    if (message !== "") {
      $messageInput.val("");

      selfTalk(message);

      // api调用
      $.ajax({
        type: "POST",
        url: "/Home/ChatWithGPT",
        data: { input: message },
        success: function (data) {
          robotTalk(data.answer);
        },
        error: function () {
          alert("出现错误,请重试");
        }
      });
    }
  });

  function selfTalk(str) {
    const messageData = {
      content: str,
      time: formatAMPM(),
      avatarSrc: '/img/_M.jpg'
    };

    const $msgContainer = $('<div>', { class: 'd-flex justify-content-end mb-4' });
    const $imgContainer = $('<div>', { class: 'msg_cotainer_send' });
    const $avatar = $('<img>', { src: messageData.avatarSrc, class: 'rounded-circle user_img_msg' });
    const $msgContent = $('<div>', { class: 'img_cont_msg' });
    const $message = $('<span>').text(messageData.content);
    const $time = $('<span>', { class: 'msg_time_send' }).text(messageData.time);

    // 提问信息显示
    $imgContainer.append($message, $time);
    $msgContent.append($avatar);
    $msgContainer.append($imgContainer, $msgContent);

    // 将创建的元素追加到页面上合适的位置
    $chatBox.append($msgContainer);
    // 滚动条移动至最后位置
    $chatBox.scrollTop($chatBox[0].scrollHeight);

  }

  function robotTalk(str) {
    var $chatBox = $(".card-body");

    const answerData = {
      content: str,
      time: formatAMPM(),
      avatarSrc: '/img/_D.jpg'
    };

    const $msgContainer = $('<div>', { class: 'd-flex justify-content-start mb-4' });
    const $msgContent = $('<div>', { class: 'img_cont_msg' });
    const $avatar = $('<img>', { src: answerData.avatarSrc, class: 'rounded-circle user_img_msg' });
    const $imgContainer = $('<div>', { class: 'msg_cotainer' });
    const $message = $('<span>').text('');
    const $time = $('<span>', { class: 'msg_time' }).text(answerData.time);
    const $noPrint = $('<span>', { class: 'noPrint' }).text("STOP");

    // 应答信息显示
    $msgContent.append($avatar);
    $imgContainer.append($message, $time, $noPrint);
    $msgContainer.append($msgContent, $imgContainer);

    // 将创建的元素追加到页面上合适的位置
    $chatBox.append($msgContainer);
    // 滚动条移动至最后位置
    $chatBox.scrollTop($chatBox[0].scrollHeight);

    // 文字打印
    printString(answerData.content, $message, $chatBox);

  }

  // api连接测试并修改机器人在线状态
  function chkOnline(msg) {
    // api调用
    $.ajax({
      type: "GET",
      url: "/Home/TryGPT",
      data: null,
      success: function (data) {
        var $icon = $('#onlineStatus');
        if (!/^2\d{2}$/.test(data.statusCode)) {
          $icon.removeClass('online_icon');
          $icon.addClass('offline');

          if (msg != "" || msg != null) {
            robotTalk(msg);
          }
        } else {
          $icon.removeClass('offline');
          $icon.addClass('online_icon');
        }
      },
      error: function () {
        alert("出现错误,请重试");
      }
    });
  }

  // 立即停止打印文字
  let printIsStop = false;

  // 开始打印字符串
  function printString(content, $message, $chatBox) {
    // 打印字符的时间间隔（毫秒）
    var interval = 50;

    var index = 0;
    var timer = setInterval(function () {
      // 添加一个字符到显示栏
      var tmp = $message.text();
      $message.text(tmp + content[index]);
      index++;
      // 滚动条移动至最后位置
      $chatBox.scrollTop($chatBox[0].scrollHeight);

      // 如果所有字符都打印完毕，则清除定时器
      if (index === content.length || printIsStop) {
        $message.next().next().remove();
        printIsStop = false;
        clearInterval(timer);
      }
    }, interval);

  }

  function formatAMPM() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }


  // ###########################################################
  // 測試用
  $block.on("click", function () {

    const stringsArray =
      [
        "如果您发现在执行 $('html, body').animate({ scrollTop: 0 }, 80); 后导致画面尺寸放大，可能有几种可能性需要考虑："
        + "CSS动画效果导致的尺寸变化：该动画可能会改变页面的布局或者尺寸，导致内容被放大。您可以检查相关的CSS样式，确保动画效果不会改变页面尺寸。"
        + "jQuery动画函数引发的问题：在某些情况下，jQuery的动画函数可能会导致页面尺寸变化。您可以尝试调整动画的参数或者使用其他方式来实现所需的效果。"
        + "事件处理函数的影响：如果该动画是作为事件处理函数的一部分执行的，可能是事件本身导致了页面尺寸变化。确保事件处理函数没有意外的副作用。"
        + "为了解决这个问题，您可以尝试以下方法：检查动画代码，确保它不会直接或间接地改变页面尺寸。如果可能的话，尝试使用原生JavaScript代替jQuery来执行动画，"
        + "看是否仍然出现同样的问题。如果您确定问题是由于动画效果导致的，可以尝试调整动画的参数或者更改实现方式。在动画执行之后，使用调试工具检查页面元素和样式，"
        + "查看是否有任何意外的变化发生。通过仔细检查代码并排除可能的原因，您应该能够解决这个问题。如果您发现在执行 $('html, body').animate({ scrollTop: 0 }, 80); "
        + "后导致画面尺寸放大，可能有几种可能性需要考虑：CSS动画效果导致的尺寸变化：该动画可能会改变页面的布局或者尺寸，导致内容被放大。您可以检查相关的CSS样式，"
        + "确保动画效果不会改变页面尺寸。jQuery动画函数引发的问题：在某些情况下，jQuery的动画函数可能会导致页面尺寸变化。"
        + "您可以尝试调整动画的参数或者使用其他方式来实现所需的效果。事件处理函数的影响：如果该动画是作为事件处理函数的一部分执行的，可能是事件本身导致了页面尺寸变化。"
        + "确保事件处理函数没有意外的副作用。为了解决这个问题，您可以尝试以下方法：检查动画代码，确保它不会直接或间接地改变页面尺寸。如果可能的话，"
        + "尝试使用原生JavaScript代替jQuery来执行动画，看是否仍然出现同样的问题。如果您确定问题是由于动画效果导致的，可以尝试调整动画的参数或者更改实现方式。"
        + "在动画执行之后，使用调试工具检查页面元素和样式，查看是否有任何意外的变化发生。通过仔细检查代码并排除可能的原因，您应该能够解决这个问题。"
        + "如果您发现在执行 $('html, body').animate({ scrollTop: 0 }, 80); 后导致画面尺寸放大，可能有几种可能性需要考虑：CSS动画效果导致的尺寸变化："
        + "该动画可能会改变页面的布局或者尺寸，导致内容被放大。您可以检查相关的CSS样式，确保动画效果不会改变页面尺寸。jQuery动画函数引发的问题："
        + "在某些情况下，jQuery的动画函数可能会导致页面尺寸变化。您可以尝试调整动画的参数或者使用其他方式来实现所需的效果。事件处理函数的影响："
        + "如果该动画是作为事件处理函数的一部分执行的，可能是事件本身导致了页面尺寸变化。确保事件处理函数没有意外的副作用。为了解决这个问题，您可以尝试以下方法："
        + "检查动画代码，确保它不会直接或间接地改变页面尺寸。如果可能的话，尝试使用原生JavaScript代替jQuery来执行动画，看是否仍然出现同样的问题。"
        + "如果您确定问题是由于动画效果导致的，可以尝试调整动画的参数或者更改实现方式。在动画执行之后，使用调试工具检查页面元素和样式，查看是否有任何意外的变化发生。"
        + "通过仔细检查代码并排除可能的原因，您应该能够解决这个问题。"

        , "如果您确定问题是由于动画效果导致的，可以尝试调整动画的参数或者更改实现方式。在动画执行之后，使用调试工具检查页面元素和样式，"
        + "查看是否有任何意外的变化发生。通过仔细检查代码并排除可能的原因，您应该能够解决这个问题。如果您发现在执行 $('html, body').animate({ scrollTop: 0 }, 80); "
        + "后导致画面尺寸放大，可能有几种可能性需要考虑：CSS动画效果导致的尺寸变化：该动画可能会改变页面的布局或者尺寸，导致内容被放大"

        , "如果您确定问题是由于动画效果导致的，可以尝试调整动画的参数或者更改实现方式。在动画执行之后，使用调试工具检查页面元素和样式，查看是否有任何意外的变化发生。"
        + "通过仔细检查代码并排除可能的原因，您应该能够解决这个问题。"

        , "确保事件处理函数没有意外的副作用。"

        , "确保动画效果不会改变页面尺寸。"

        , "通过仔细检查代码并排除可能的原因。"

        , "事件处理函数的影响。"

        , "查看是否有任何意外的变化发生。"

        , "可以尝试调整动画的参数或者更改实现方式。在动画执行之后，使用调试工具检查页面元素和样式，查看是否有任何"

        , "abcdefhijklmnopqrstuvwxyz1234567890"

        , "如果该动画是作为事件处理函数的一部分执行的，"

      ];

    const randomIndex = Math.floor(Math.random() * stringsArray.length);
    const randomString = stringsArray[randomIndex];

    $('.action_menu').toggle();
    robotTalk(randomString);
  });

  // 測試連接
  $checkOnline.on("click", function () {
    $('.action_menu').toggle();

    // api连接测试
    chkOnline("我現在不在線，請稍等");
    // 每 5 分钟检测api连接状态
    //setInterval(chkOnline, 50000);

  });

});




// ###########################################################