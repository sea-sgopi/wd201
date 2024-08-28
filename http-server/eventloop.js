console.log("Hello 1");

setTimeout(function() {
    console.log('Hello 2');
}, 1000);
console.log('Hello 3');


// Closure properrty
function generateGreetings(name) {
    function spanish() {
        console.log(`hola ${name}`);
    }
    function english() {
        console.log(`hello ${name}`);
    }
    return {spanish,english};
};

const name = 'john';
const greetings = generateGreetings();
console.log(typeof(greetings.spanish));
greetings.spanish();
greetings.english();