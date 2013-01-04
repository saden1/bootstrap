describe('button', function () {

  var $rootScope, $compile;
  beforeEach(module('ui.bootstrap.button'));
  beforeEach(inject(function (_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  describe('initial state', function () {
    it('should render button without active class if no toggle attribute present selected', function () {
      var elm = $compile('<button>Click me</button>')($rootScope);
      $rootScope.$digest();

      expect(elm).toHaveClass('btn');
      expect(elm).not.toHaveClass('active');
    });

    it('should render button without active class if the toggle attribute evaluates to false', function () {
      var elm = $compile('<button toggle="selected">Click me</button>')($rootScope);
      $rootScope.$apply('selected = false');

      expect(elm).toHaveClass('btn');
      expect(elm).not.toHaveClass('active');
    });

    it('should render button with active class if the toggle attribute evaluates to true', function () {
      var elm = $compile('<button toggle="selected">Click me</button>')($rootScope);
      $rootScope.$apply('selected = true');

      expect(elm).toHaveClass('btn');
      expect(elm).toHaveClass('active');
    });
  });

  describe('click event', function () {

    it('should toggle class on click if the toggle attribute is present', function () {
      var elm = $compile('<button toggle="selected">Click me</button>')($rootScope);
      $rootScope.$apply('selected = true');

      expect($rootScope.selected).toEqual(true);
      elm.click();
      expect($rootScope.selected).toEqual(false);
      elm.click();
      expect($rootScope.selected).toEqual(true);
    });
  });
});