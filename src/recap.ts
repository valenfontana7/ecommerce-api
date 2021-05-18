const myName = 'Valentin';
const myAge = 20;
const suma = (a: number, b: number) => {
  return a + b;
};
suma(12, 65);

class Persona {
  constructor(private age: number, private name: string) {}

  getSummary() {
    return `my name is ${this.name}, ${this.age}`;
  }
}
const valentin = new Persona(20, 'Valentin');
valentin.getSummary();
