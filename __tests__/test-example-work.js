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

  it("Should be a section element", () => {
    // console.log(component.debug());
    expect(component.type()).toEqual('section');
  });

  it("Should contain as many children as there are work examples", () => {
    // console.log(component.debug());
    expect(component.find("ExampleWorkBubble").length).toEqual(myWork.length);
  });
});

describe("ExampleWorkBubble component", () => {
  let component = shallow(<ExampleWorkBubble example={myWork[1]}/>);
  let images = component.find("img");

  it("It should contain a single img element", () => {
    expect(images.length).toEqual(1);
  });

  it("Should have the image source set correctly", () => {
    expect(images.prop('src')).toEqual(myWork[1].image.src);
  });
});
