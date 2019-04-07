package Pyramide;

import java.util.Scanner;

public class Main {

    public static void pyramide(int n) {

        for(int i=0 ; i<n ; i++) {

            for(int j=0 ; j<n-i ;j++) {

                System.out.print(" ");
            }
            for(int k=0 ; k<=i ; k++) {

                System.out.print("* ");
            }
            System.out.print("\n");
        }
    }


    public static void main(String args[]) {

        System.out.print("Hello there , you should enter number of the lines n : ");
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        pyramide(x);
    }

}