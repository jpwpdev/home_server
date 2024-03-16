import json

# Load the current data from a file
def load_data(filename):
    with open(filename, 'r') as file:
        data = json.load(file)
    return data

# Update the data structure
def update_structure(chore_data):
    updated_data = {}
    for key, chores in chore_data.items():
        updated_data[key] = [{'name': chore, 'checked': False} for chore in chores]
    return updated_data

# Save the updated data to a file
def save_data(filename, data):
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4)

def main():
    filename = 'choreData.json' # Update this with the path to your file
    current_data = load_data(filename)
    updated_data = update_structure(current_data)
    save_data(filename, updated_data)
    print("Data structure updated successfully.")

if __name__ == "__main__":
    main()
