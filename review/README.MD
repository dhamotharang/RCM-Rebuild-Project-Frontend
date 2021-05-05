# RCM FFR Pull Request Review
1. JavaScript Naming Standards
    - camelCase (variables, functions)
    - kebab-case (file names)
2. Descriptive Variable Names
    - Variables should be Nouns
    - Functions should be Verbs
3. Code Comments
4. Debuggers
5. Magic numbers
    ```
        // Magic number (Bad)
        function convertMeterToKm(meters: number) {
            return meters / 1000;
        }

        // Magic number (Fixed)   
        function convertMeterToKm(meters: number) {
            const oneKmToMeterValue = 1000;
            return meters / meterToKmConversion;
        }
    ```