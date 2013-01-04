angular.module('ui.bootstrap.button', [])

  .directive('button', ['$parse', function($parse) {
    return {
      restrict: 'E',
      compile:function (tElement, tAttrs, transclude) {
        tElement.addClass('btn');
        return function (scope, element, attrs) {
          if (attrs.toggle){

            var exprGetter = $parse(attrs.toggle);
            var exprSetter = exprGetter.assign;

            //watch model changes
            scope.$watch(attrs.toggle, function(newVal){
              if (newVal) {
                element.addClass('active');
              } else {
                element.removeClass('active');
              }
            });

            //watch click events
            element.bind('click', function(){
               scope.$apply(function(){
                 exprSetter(scope, !exprGetter(scope));
               });
            });
          }
        };
      }
    };
  }]);