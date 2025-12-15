# Code Example Templates

This document provides templates for creating code examples in different programming languages.

## Python Template

```python
def example_function(param1, param2):
    """
    Brief description of what the function does.
    
    Args:
        param1 (type): Description of param1
        param2 (type): Description of param2
        
    Returns:
        type: Description of return value
    """
    # Implementation goes here
    result = param1 + param2
    return result

# Example usage
if __name__ == "__main__":
    value = example_function(5, 3)
    print(f"Result: {value}")
```

## JavaScript Template

```javascript
/**
 * Brief description of what the function does.
 * 
 * @param {type} param1 - Description of param1
 * @param {type} param2 - Description of param2
 * @returns {type} Description of return value
 */
function exampleFunction(param1, param2) {
    // Implementation goes here
    const result = param1 + param2;
    return result;
}

// Example usage
const value = exampleFunction(5, 3);
console.log(`Result: ${value}`);
```

## Java Template

```java
/**
 * Brief description of the class or method.
 */
public class ExampleClass {
    
    /**
     * Brief description of what the method does.
     * 
     * @param param1 Description of param1
     * @param param2 Description of param2
     * @return Description of return value
     */
    public static int exampleMethod(int param1, int param2) {
        // Implementation goes here
        int result = param1 + param2;
        return result;
    }
    
    // Example usage
    public static void main(String[] args) {
        int value = exampleMethod(5, 3);
        System.out.println("Result: " + value);
    }
}
```

## C++ Template

```cpp
#include <iostream>

/**
 * Brief description of what the function does.
 * 
 * @param param1 Description of param1
 * @param param2 Description of param2
 * @return Description of return value
 */
int exampleFunction(int param1, int param2) {
    // Implementation goes here
    int result = param1 + param2;
    return result;
}

// Example usage
int main() {
    int value = exampleFunction(5, 3);
    std::cout << "Result: " << value << std::endl;
    return 0;
}
```

## General Guidelines for Code Examples

1. Keep examples concise but complete
2. Include comments that explain the purpose of key code sections
3. Use descriptive variable and function names
4. Include example usage to demonstrate how to use the code
5. Follow language-specific conventions and best practices
6. Add error handling where appropriate for production code
7. Include brief documentation using the language's standard documentation format