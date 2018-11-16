import React from 'react';
import {shallow } from 'enzyme';
import ExampleWork, { ExampleWorkBubble } from '../js/example-work';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

const myWork = [
  {
    'title': "Work Example 1",
    'image': {
      'desc': "example screenshot of a project involving code",
      'src': "images/example1.png",
      'comment': ""
    }
  },
  {
    'title': "Work Example 2",
    'image': {
      'desc': "example screenshot of a project involving chemistry",
      'src': "images/example2.png",
      'comment': ""
    }
  }
]

describe("ExampleWork component", () => {
  let component = shallow(<ExampleWork work={myWork}/>);

  it("Should be a 'span' element", () => {
    // console.log(component.debug());
    expect(component.type()).toEqual('span');
  });

  it("Should contain as many children as there are work examples", () => {
    // console.log(component.debug());
    expect(component.find("ExampleWorkBubble").length).toEqual(myWork.length);
  });

  it("Should allow the modal to open and close", () => {
    // instance() provided by Enzyme to allow access to functions and properties
    component.instance().openModal();
    expect(component.instance().state.modalOpen).toBe(true);
    component.instance().closeModal();
    expect(component.instance().state.modalOpen).toBe(false);
  })
});

describe("ExampleWorkBubble component", () => {
  let mockOpenModalFn = jest.fn();
  let mockCloseModalFn = jest.fn();

  let component = shallow(<ExampleWorkBubble example={myWork[1]}
    openModal={mockOpenModalFn}/>);
  let images = component.find("img");

  let closeComponent = shallow(<ExampleWorkBubble example={myWork[1]}
    openModal={mockCloseModalFn}/>);

  it("It should contain a single img element", () => {
    expect(images.length).toEqual(1);
  });

  it("Should have the image source set correctly", () => {
    expect(images.prop('src')).toEqual(myWork[1].image.src);
  });

  it("Should call the openModal function when clicked", () => {
    component.find(".section__exampleWrapper").simulate('click');
    expect(mockOpenModalFn).toHaveBeenCalled();
  })

  it("Should call the closeModal function when clicked", () => {
    closeComponent.find(".section__exampleWrapper").simulate('click');
    expect(mockCloseModalFn).toHaveBeenCalled();
  })
});
