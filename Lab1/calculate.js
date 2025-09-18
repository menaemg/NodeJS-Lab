const [, , action, ...numbers] = process.argv;

function calculate(action, numbers) {
    switch (action) {
        case "add":
            return numbers.reduce((acc, val) => acc + +val, 0);

        case "divide":
            if (+numbers[1] === 0) {
                return "error, you can't divide / 0"
            }
            return numbers[0] / numbers[1];

        case "sub": 
            return numbers.reduce((acc, num) => acc - num);
        
        case "multiply":
            return numbers.reduce((acc, num) => acc * num);

        default:
            return "invalid action";
    }
}

console.log("🚀 ~ params:", action, numbers);

console.log("🚀 ~ result:", calculate(action, numbers));