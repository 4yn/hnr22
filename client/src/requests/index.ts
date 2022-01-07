const SERVER = "http://localhost:3000";

export interface CellData {
  secret: string;
  result: string;
  type: "img" | "code";
  rawCode: string;
}

const routes = {
  root: "/",
  data: "/data",
};

export function requestData() {
  return fetch(SERVER + routes.data)
    .then((res) => res.json())
    .catch(() => {
      console.log("err");
    });
}

type Student = {
  name: string;
  secret: string;
};

type AnswerSubmission = {
  answer: string
  code: string;
  timestamp: Date;
  student: Student;
};

export type ResponseData = {
  [question: string]: AnswerSubmission[];
};

const sample_response: ResponseData = {
  Q1: [
    {
      answer: '1337',
      code: `# Program to check if a number is prime or not

num = 29

# To take input from the user
#num = int(input("Enter a number: "))

# define a flag variable
flag = False

# prime numbers are greater than 1
if num > 1:
    # check for factors
    for i in range(2, num):
        if (num % i) == 0:
            # if factor is found, set flag to True
            flag = True
            # break out of loop
            break

# check if flag is True
if flag:
    print(num, "is not a prime number")
else:
    print(num, "is a prime number")`,
      timestamp: new Date(),
      student: {
        name: "Primerz",
        secret: "verysecret",
      },
    },
    {
      answer: 'riperino',
      code: `nx, ny = .3, .3
x = np.arange(-6, 6, nx)
y = np.arange(-6, 6, ny)
X, Y = np.meshgrid(x, y)

dx = -3/2 * X + Y
dy = -1/4 * X - 1/2 * Y

plt.quiver(X, Y, dx, dy, 
           color='Teal', 
           headlength=7, figure=fig)

plt.streamplot(X, Y, dx, dy, color='blue', density=1, cmap='jet', arrowsize=1, figure=fig)`,
      timestamp: new Date(),
      student: {
        name: "John Doe",
        secret: "verysecret",
      },
    },
  ],
};

export async function getStudentData() {
  return sample_response;
}
