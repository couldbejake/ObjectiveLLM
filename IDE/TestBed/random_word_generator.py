import random

# Predefined list of words
words = ["apple", "banana", "cherry", "date", "fig", "grape"]

# Function to generate a random word
def generate_random_word():
    return random.choice(words)

# Main execution
if __name__ == "__main__":
    random_word = generate_random_word()
    print(random_word)