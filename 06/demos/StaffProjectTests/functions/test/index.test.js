const config = {
    databaseURL: "https://staffprojecttests.firebaseio.com",
    projectId: "staffprojecttests",
    storageBucket: "staffprojecttests.appspot.com",
}
const test = require('firebase-functions-test')(config, './accountKey.json');

const myFunctions = require('../index.js');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;

describe('addTodoItem', () =>{
    it('should return a 303 redirect', (done) => {
        const req = {query: {text:'input'}};
        const res = {
            redirect: (code, url) => {
                assert.equal(code,303);
                const expectedRef = new RegExp(config.databaseURL + '/todoitems/');
                assert.isTrue(expectedRef.test(url));
                done();
            }
        };
        myFunctions.addTodoItem(req,res);
    })
})

describe('toUpperCase', () => {
    it('should upper case input and write it to /uppercase', () => {
        const childParam = 'uppercase';
        const setParam = 'INPUT';
        const childStub = sinon.stub();
        const setStub = sinon.stub();

        const snap = {
            val: () => 'input',
            ref:{
                parent: {
                    child: childStub,
                }
            }
        };
        childStub.withArgs(childParam).returns({set: setStub});
        setStub.withArgs(setParam).returns(true);

        const wrapped = test.wrap(myFunctions.toUpperCase);

        return assert.equal(wrapped(snap), true);
        
    })
})
