'use strict';
(function() {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    var $storyEndPopup = $('#J_StoryEndPopup');
    function toggleStoryEndPopup(on) {
        if ($storyEndPopup.length === 0) {
            return;
        }

        $storyEndPopup.velocity(on ? 'fadeIn' : 'fadeOut', { display: on ? 'block' : 'none' });
        $('body').css('overflow', on ? 'hidden' : '');
    }

    var $storyMainBox = $('#J_StoryMainBox');
    var $storyContentList = $('#J_StoryContentList');
    var gCurrentDialogItemIndex = 0;
    var gIsClick = false;

    $(document)
        // use touchstart & touchmove & touchend to instead of click
        // because of QQWebView
        .on('touchstart', '#J_StoryContent', function() {
            gIsClick = true;
        })
        .on('touchmove', '#J_StoryContent', function() {
            gIsClick = false;
        })
        .on('touchend', '#J_StoryContent', function() {
            if (!gIsClick) {
                return;
            }
            play();
        })
        // for non touch event browser
        .on('click', '#J_StoryContent', function() {
            if (gIsClick) {
                return;
            }
            play();
        })
        .on('click', '#J_GuideStoryClick', function() {
            hideGuide();
            $('#J_StoryContent').trigger('click');
        });

    function play() {
        if ($storyMainBox.hasClass('velocity-animating')) {
            return;
        }

        var $item = $storyContentList.children().eq(gCurrentDialogItemIndex);
        if ($item.length === 0) {
            toggleStoryEndPopup(true);
            $('#J_StoryMainBox').addClass('the-end');
            $('#J_StoryEndTips').fadeIn();
            $('#J_TopDownloadTips').fadeIn();
            return;
        }

        $item.css({
            display: 'block',
            opacity: '0'
        });

        var delta = $storyMainBox.outerHeight() - $(window).height();
        if (delta > 0) {
            $storyMainBox.velocity('scroll', {
                offset: Math.ceil(delta),
                duration: 400,
                complete: function() {
                    $item.css('opacity', 1);
                }
            });
            $('#J_TopDownloadTips').fadeIn();
        } else {
            $item.css('opacity', 1);
        }

        gCurrentDialogItemIndex += 1;

        if (gCurrentDialogItemIndex > 1) {
            hideGuide();
        }
    }

    function hideGuide() {
        $('#J_GuideStoryClick').velocity('fadeOut', { display: 'none' });
    }

    $storyEndPopup
        .on('touchstart', function(evt) {
            var $target = $(evt.target);
            if ($target.is('.ui-popup-content') || $target.closest('.ui-popup-content').length > 0) {
                return;
            }

            evt.preventDefault();
            toggleStoryEndPopup(false);
        })
        .on('touchmove', function(evt) {
            evt.preventDefault();
        });

    // show first dialog
    $('#J_StoryContent').trigger('click');
    // show story end popup if
    // if (/(from=timeline)|(from=singlemessage)|(from=groupmessage)/.test(location.search)) {
    //     if (!/MicroMessenger/.test(navigator.userAgent)) {
    //         toggleStoryEndPopup(true);
    //         location.href = $('#J_DownloadLink').attr('href');
    //     }
    // }

    // try to open app
    if (/android/i.test(navigator.userAgent)) {
        $('<iframe style="position:absolute;left:-9999em;top:-9999em;" src="crucio://story/' + $('#J_StoryMainBox').data('sid') + '">')
            .appendTo('body');
    }
})();
