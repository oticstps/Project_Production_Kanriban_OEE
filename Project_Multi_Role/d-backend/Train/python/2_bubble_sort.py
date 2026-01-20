import time

my_array = [7,88,5,5,6,7,54,7,6,5,7,3,9,12,11]
n = len(my_array)
for i in range(n-1):
    swapped = False
    for j in range(n-i-1):
        if my_array[j] > my_array[j+1]:
            my_array[j], my_array[j+1] = my_array[j+1], my_array[j]
            swapped = True
            print(my_array)
            time.sleep(1)
    if not swapped:
        break

print("Sorted array ", my_array)



