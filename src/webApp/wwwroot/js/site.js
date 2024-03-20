$(function () {

  $('#action_menu_btn').on("click", function () {
    $('.action_menu').toggle();
  });


  var $chatBox = $(".card-body");
  var $messageInput = $("#message-input");
  var $sendButton = $("#send-button");
  var $icon = $('#onlineStatus');

  // 监听窗口大小变化以重新计算[card]的显示高度
  window.addEventListener('resize', adjustDivHeight);
  function adjustDivHeight() {
    var $card = $(".card");
    $card.attr("height", window.innerHeight + 'px');
  }

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


  $sendButton.on("click", function () {

    if ($icon.hasClass('offline')) {
      alert("Tommy 不在线，请稍等.");
      return;
    }

    var message = $messageInput.val().trim();

    if (message !== "") {
      $messageInput.val("");

      const messageData = {
        content: message,
        // TODO 时间需要更新
        time: '8:40 AM, Today',
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


      // api调用
      $.ajax({
        type: "POST",
        url: "/Home/ChatWithGPT",
        data: { input: message },
        success: function (data) {

          const answerData = {
            content: data.answer,
            // TODO 时间需要更新
            time: '8:40 AM, Today',
            avatarSrc: '/img/_D.jpg'
          };

          const $msgContainer = $('<div>', { class: 'd-flex justify-content-start mb-4' });
          const $msgContent = $('<div>', { class: 'img_cont_msg' });
          const $avatar = $('<img>', { src: answerData.avatarSrc, class: 'rounded-circle user_img_msg' });
          const $imgContainer = $('<div>', { class: 'msg_cotainer' });
          const $message = $('<span>').text('');
          const $time = $('<span>', { class: 'msg_time' }).text(answerData.time);

          // 应答信息显示
          $msgContent.append($avatar);
          $imgContainer.append($message, $time);
          $msgContainer.append($msgContent, $imgContainer);

          // 将创建的元素追加到页面上合适的位置
          $chatBox.append($msgContainer);
          // 滚动条移动至最后位置
          $chatBox.scrollTop($chatBox[0].scrollHeight);

          // 文字打印
          printString(answerData.content, $message, $chatBox);

        },
        error: function () {
          alert("出现错误,请重试");
        }
      });
    }
  });

  // api连接测试
  testCall();

  // 每 2 分钟检测api连接状态
  setInterval(testCall, 20000);

});


// api连接测试并修改机器人在线状态
function testCall($icon) {
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
      } else {
        $icon.removeClass('offline');
        $icon.addClass('online_icon');
      }
    },
    error: function () {
      alert("出现错误,请重试");
      $('.online_icon').addClass('offline');
    }
  });
}


// 开始打印字符串
function printString(content, $message, $chatBox) {
  // 打印字符的时间间隔（毫秒）
  var interval = 80;

  var index = 0;
  var timer = setInterval(function () {
    // 添加一个字符到显示栏
    var tmp = $message.text();
    $message.text(tmp + content[index]);
    index++;
    // 滚动条移动至最后位置
    $chatBox.scrollTop($chatBox[0].scrollHeight);

    // 如果所有字符都打印完毕，则清除定时器
    if (index === content.length) {
      clearInterval(timer);
    }
  }, interval);

}