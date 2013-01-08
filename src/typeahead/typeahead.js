angular.module('ui.bootstrap.typeahead', [])

  .directive('typeaheadPopup', function () {

    return {
      restrict:'E',
      scope:{
        matches:'=',
        query:'=',
        active:'=',
        select:'&onSelect'
      },
      replace:true,
      templateUrl:'template/typeahead/typeahead.html',
      link:function (scope, element, attrs) {

        scope.isOpen = function () {
          return scope.matches.length > 0;
        };

        scope.isActive = function (matchIdx) {
          return scope.active == matchIdx;
        };

        scope.selectActive = function (matchIdx) {
          scope.active = matchIdx;
        };

        scope.selectMatch = function (activeIdx) {
          scope.select({activeIdx:activeIdx});
        };
      }
    };
  })

/**
 *  Supported attributes:
 *  * typeahead-source - source collection
 *  * typeahead-min-search - minimal no of chars before match occus - default 1
 *  * typeahead-max-items - max no of results displayed - limited to 100 by default
 *  * typeahead-order - order in whcih matches should be presented - support the same arguments as the orderByFilter
 */
  .directive('typeaheadSource', ['$compile', '$filter', function ($compile, $filter) {
  return {
    require:'ngModel',
    link:function (scope, element, attrs, modelCtrl) {

      //results to be displayed in the type-ahead popup
      var source = scope.$eval(attrs.typeaheadSource);
      var maxItems = scope.$eval(attrs.typeaheadMaxItems) || 4;
      var minSearch = scope.$eval(attrs.typeaheadMinSearch) || 1;
      var orderExp = scope.$eval(attrs.typeaheadOrder);

      var hotKeys = [9, 13, 27, 38, 40];

      /**
       * Was an item selected by a user?
       * @type {Boolean}
       */
      var selected = false;

      scope.matches = [];
      scope.activeIdx = -1;
      scope.query = undefined;

      //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
      modelCtrl.$parsers.push(function (inputValue) {

        scope.activeIdx = -1;
        if (inputValue && inputValue.length >= minSearch) {
          if (!selected) {
            scope.query = inputValue;
            scope.matches = $filter('limitTo')($filter('filter')(source, inputValue), maxItems) || [];
            if (scope.matches.length > 0) {
              if (orderExp) {
                scope.matches = $filter('orderBy')(scope.matches, orderExp);
              }
              scope.activeIdx = 0;
            }
          } else {
            scope.matches = [];
            selected = false;
          }
        } else {
          scope.matches = [];
        }

        return inputValue;
      });

      scope.select = function (activeIdx) {

        //called from within the $digest() cycle
        selected = true;
        modelCtrl.$setViewValue(scope.matches[activeIdx]);
        modelCtrl.$render();
      };

      //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(9)
      element.bind('keydown', function (evt) {

        //typeahead is open and an "interesting" key was pressed
        if (scope.matches.length === 0 || hotKeys.indexOf(evt.which) === -1) {
          return;
        }

        evt.preventDefault();

        if (evt.which === 40) {
          scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
          scope.$digest();

        } else if (evt.which === 38) {
          scope.activeIdx = (scope.activeIdx ? scope.activeIdx : scope.matches.length) - 1;
          scope.$digest();

        } else if (evt.which === 13 || evt.which === 9) {
          scope.$apply(function () {
            scope.select(scope.activeIdx);
          });

        } else if (evt.which === 27) {
          scope.matches = [];
          scope.$digest();
        }
      });

      var tplElCompiled = $compile("<typeahead-popup matches='matches' active='activeIdx' on-select='select(activeIdx)' query='query'></typeahead-popup>")(scope);
      element.after(tplElCompiled);
    }
  };
}])
  .filter('matchHighlighter', function() {
    return function(text, expression) {
      return (expression) ? text.replace(new RegExp(expression, 'gi'), '<strong>$&</strong>') : text;
    };
  });
