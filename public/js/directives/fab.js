angular.module('fab-directive', []).directive('fab', ['$log', 'Loading', '$timeout', function ($log, Loading, $timeout) {
    return {
        restrict: 'E',
        //templateUrl: '/public/views/fab.html',
        template: '<div>' + '<div class="fab" ng-class="{ open: open}"><a id="fab-circle"></a>' +
        '<i class="ion-navicon"></i> <i class="ion-close"></i> <img src="@@path/img/tail-spin.svg" width="30px">' +
        '<span id="fab-message" ng-bind="message"></span> <span id="fab-width-calculator"></span> </a>' +
        '<li> <a href="/developers"> <i class="ion-settings"></i> <span>My Apps</span></a></li>' +
        '<li><a href="/network/monitoring"><i class="ion-network"></i><span>Monitoring</span></a></li>' +
        '<li><a href="/developers/apps/new-app"><i class="ion-plus-circled"></i><span>New app</span></a></li>' +
        '</ul> </div> </div>' +  '</div>',
        scope: true,
        replace: true,
        link: function (scope, element) {

            function findElement(selector) {
                return angular.element(element[0].querySelector(selector));
            }

            function outerWidth(el) {
                var width = el.offsetWidth;
                var style = getComputedStyle(el);

                width += parseInt(style.marginLeft) + parseInt(style.marginRight);
                return width;
            }

            var iconWidth = 30,
                padding = 50,
                fabCircle = findElement('#fab-circle'),
                fabMessage = findElement('#fab-message'),
                fabCalculator = findElement('#fab-width-calculator');

            function getMessageWidth(text) {
                fabCalculator.text(text);
                return outerWidth(fabCalculator[0]);
            }

            function updateWidth(text) {
                var width, textWidth;
                if (text) {
                    textWidth = getMessageWidth(text) + 10;
                    width = textWidth + iconWidth + padding;

                    fabCircle.css({ width: width + 'px' });
                    fabMessage.css({ width: textWidth + 'px' });
                } else {
                    fabCircle[0].removeAttribute('style');
                    fabMessage.css({ width: '0px' });
                }
            }

            Loading.onStart(function (msg) {
                updateWidth(msg);
                element.addClass('loading');
                scope.message = msg;
            });

            Loading.onSuccess(function (msg) {
                updateWidth(msg);
                element.addClass('loading');
                element.removeClass('loading-error');
                element.addClass('loading-success');
                scope.message = msg;

                $timeout(function () {
                    updateWidth('');
                    element.removeClass('loading');
                    element.removeClass('loading-success');
                }, 2000);
            });

            Loading.onError(function (msg) {
                element.addClass('loading');
                element.addClass('loading-error');
                updateWidth(msg);
                scope.message = msg;

                $timeout(function () {
                    updateWidth();
                    element.removeClass('loading');
                    element.removeClass('loading-error');
                }, 2000);
            });

            element.find('a').on('click', function () {
                $timeout(function () {
                    scope.open = !scope.open;
                });
            });

            element.on('mouseenter', function () {
                if (!element.hasClass('loading')) {
                    scope.$apply(function () {
                        scope.open = true;
                    });
                }
            });

            element.on('mouseleave', function () {
                scope.$apply(function () {
                    scope.open = false;
                });
            });
        }
    };
}]);
