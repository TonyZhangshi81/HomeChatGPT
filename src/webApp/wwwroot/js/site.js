﻿$(function () {

  var $chatBox = $(".card-body");
  var $messageInput = $("#message-input");
  var $sendButton = $("#send-button");

  $messageInput.on("keypress", function (event) {
    if (event.key === "Enter") {
      $sendButton.trigger('click');
      event.preventDefault();
    }
  });

  $sendButton.on("click", function () {
    var message = $messageInput.val().trim();

    const messageData = {
      content: message,
      time: '8:40 AM, Today',
      avatarSrc: '/img/_M.jpg'
    };

    const $msgContainer = $('<div>', { class: 'd-flex justify-content-end mb-4' });
    const $imgContainer = $('<div>', { class: 'msg_cotainer_send' });
    const $avatar = $('<img>', { src: messageData.avatarSrc, class: 'rounded-circle user_img_msg' });
    const $msgContent = $('<div>', { class: 'img_cont_msg' });
    const $message = $('<span>').text(messageData.content);
    const $time = $('<span>', { class: 'msg_time_send' }).text(messageData.time);

    $imgContainer.append($message, $time);
    $msgContent.append($avatar);
    $msgContainer.append($imgContainer, $msgContent);

    // 将创建的元素追加到页面上合适的位置
    $chatBox.append($msgContainer);

    if (message !== "") {
      $messageInput.val("");
      // api调用
      $.ajax({
        type: "POST",
        url: "/Home/ChatWithGPT",
        data: { input: message },
        success: function (data) {

          const answerData = {
            content: data.answer,
            time: '8:40 AM, Today',
            avatarSrc: '/img/_D.jpg'
          };

          const $msgContainer = $('<div>', { class: 'd-flex justify-content-start mb-4' });
          const $msgContent = $('<div>', { class: 'img_cont_msg' });
          const $avatar = $('<img>', { src: answerData.avatarSrc, class: 'rounded-circle user_img_msg' });
          const $imgContainer = $('<div>', { class: 'msg_cotainer' });
          const $message = $('<span>').text(answerData.content);
          const $time = $('<span>', { class: 'msg_time' }).text(answerData.time);

          $msgContent.append($avatar);
          $imgContainer.append($message, $time);
          $msgContainer.append($msgContent, $imgContainer);

          // 将创建的元素追加到页面上合适的位置
          $chatBox.append($msgContainer);
        },
        error: function () {
          alert("出现错误,请重试");
        }
      });
    }
  });


});

