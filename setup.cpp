#include <iostream>
#include <cstdlib>
int main()
{
  system("cd front-end & npx yarn");
  system("npx yarn");
  system("start http://localhost:5173/");
  system("npx yarn dev");
  std::cin.get();
  return EXIT_SUCCESS;
}
