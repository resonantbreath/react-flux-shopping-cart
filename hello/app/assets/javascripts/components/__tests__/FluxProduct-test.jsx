jest.dontMock('../FluxProduct');

var React
  , TestUtils
  , FluxProduct
  , FluxCartActions;

describe('FluxProduct', function() {


  var SAMPLE = {
    product: {
      id: '1',
      name: 'Name',
      image: 'image.png',
      description: 'this description',
      variants: [
        {
          sku: '123',
          type: 'First',
          price: 1.99,
          inventory: 1
        },
        {
          sku: '456',
          type: 'Second',
          price: 2.99,
          inventory: 3
        },
        {
          sku: '789',
          type: 'Third',
          price: 3.99,
          inventory: 2
        }
      ]
    },
  };


  function getElement(product, className)
  {
    return product.getDOMNode().getElementsByClassName(className)[0];
  }

  function getElementByTag(product, tagName)
  {
    return product.getDOMNode().getElementsByTagName(tagName)[0];
  }

  function selectIsActive(select, text)
  {
    for( var i = 0; i < select.options.length; i++)
    {
      if (select.options[i].textContent == text)
      {
        return true
      }
    }
    return false;
  }

  beforeEach(function(){
    React = require('react/addons')
    , TestUtils = React.addons.TestUtils
    , FluxProduct = require('../FluxProduct')
    , FluxCartActions = require('../../actions/FluxCartActions');
  });

  it('should have the display all of the fields', function() {
    var cartItems = [];
    var selected = SAMPLE.product.variants[1];
    var product = TestUtils.renderIntoDocument(
      <FluxProduct selected={selected} product={SAMPLE.product} cartitems={cartItems} />
    );

    expect(getElement(product, 'name').textContent).toEqual(SAMPLE.product.name);
    expect(getElement(product, 'description').textContent).toEqual(SAMPLE.product.description);
    expect(getElement(product, 'price').textContent).toEqual('Price: $' + selected.price);
    expect(selectIsActive(getElementByTag(product, 'select'), selected.type)).toEqual(true);
  });

  it('should allow to add another variant', function() {
    var cartItems = [];
    var selected = SAMPLE.product.variants[1];
    var targetVariantIndex = 2;
    var targetVariant = SAMPLE.product.variants[targetVariantIndex];
    var product = TestUtils.renderIntoDocument(
      <FluxProduct selected={selected} product={SAMPLE.product} cartitems={cartItems} />
    );
    var selectElement = getElementByTag(product, 'select');
    var addToCartBtn = getElementByTag(product, 'select');

    TestUtils.Simulate.change(selectElement, { target: { value: targetVariantIndex } });

    expect(selectIsActive(selectElement, targetVariant.type)).toEqual(true);

    TestUtils.Simulate.click(addToCartBtn);

    expect(FluxCartActions.addToCart.mock.calls.length).toBe(1);
    expect(FluxCartActions.addToCart.mock.calls[0][0]).toBe(targetVariant.sku);
    expect(FluxCartActions.addToCart.mock.calls[0][0]).toBe({
      name: targetVariant.name,
      type: targetVariant.type,
      price: targetVariant.price
    });
  });
});
