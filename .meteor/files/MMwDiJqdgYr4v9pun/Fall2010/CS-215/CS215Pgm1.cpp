/* CS215Pgm1.cpp : main project file.  
   Author:  Matthew Jackson
   Completion Date:   

   Program sorts answers to a survey taken and can match and link different persons
   based on their respective answers. Returns a score based on their compatability.


  
   Interface to Windows display functions to find the
   closest match to the supplied answer set.
   You need to write the following functions:

   string loadDatabase(string filename) 
  		You should open the filename passed into the function.
        If there is an error opening the file, return an appropriate
        message from the function.
        If the file opens correctly, you should read in the file into
        several parallel vectors to hold the data.  See the assigment sheet
  		for more details on this.  You can assume correct data in the file.
  
	bool isDatabaseLoaded()
		INPUTS: none
		OUTPUT: a boolean indicating whether a database has been loaded.
		This function should return true if a database has been successfully loaded and false if one has not.

	string getFirstName(int id)
		INPUTS: an id indicating an index in your array of structures.  
		OUTPUTS: You should return the first name of the student in that location of the array.

	string getLastName(int id)
		INPUTS: an id indicating an index in your array of structures.  
		OUTPUT: You should return the last name of the student in that location of the array.

	vector<int> getAnswerVector(int id)
		INPUTS: an id indicating an index in your array of structures.  
		OUTPUT: You should return an int array containing the answers of the student in that location of the array.

	int compareAnswers(int answerVector1[]. int answerVector2[])
		INPUTS: 2 arrays of answers. (NUMQUESTIONS number of ints)
		OUTPUT:  The function should return an integer ranking that expresses how much alike the two 
			arrays are.  (for example an easy way to implement this would be to count up the number of 
			times that both arrays have the same integer(answer) for the same index(question))
			You must also look at the final question (array index NUMQUESTIONS-1) and figure out which
			question each student thought was most important.  That question should be weighted twice as
			heavy as a normal question, and in the case that both users pick the same question, that question
			should be weighted 4 times as heavy.
*/


#include "stdafx.h"  //needed for the Windows display
#include <string>	 //the standard string class 
#include <vector>
#include <fstream>


using namespace std;

#include "globals.h"

//Declare your global variables (the parallel arrays used to store the data) here.

	vector<string> first_name;
	vector<string> last_name;
	vector< vector<int> > answers;
	

string loadDatabase(string filename)
{
	string fn, ln;
	ifstream infile;
	infile.open(filename.c_str());

	vector <int> temp;	//To fill the answers vector
	int temp2;

	//check to see if it opened correctly and return an error message if it did not.
	if(infile.fail())
	{
		return "The file could not be opened";
	}
	else{
	first_name.clear();
	last_name.clear();
	answers.clear();
	//initialize the vectors
	
	infile>>fn>>ln;
	//loop over the data read in until it is gone, reading everything into your vectors
	while(infile)
	{
		first_name.push_back(fn);
		last_name.push_back(ln);

		for (int a=0; a<NUMQUESTIONS; a++)
		{
			infile>>temp2;
			 temp.push_back(temp2);
		}
		answers.push_back(temp);
		temp.clear();

		infile>>fn>>ln;
	}
	
	//If all went according to plan, return a success message.
	return "Database has been loaded!";}
}

bool isDatabaseLoaded()
{	
	if(!last_name.empty())
		return true;
	else
		return false;
	//return true if a database has been loaded successfully and false if one has not.

}

string getFirstName(int id)
{
	//look in your vector of first names at index 'id' and return the string you stored for that student's first name.
	return first_name[id];
}

string getLastName(int id)
{
	//look in your vector of last names at index 'id' and return the string you stored for that student's last name.
	return last_name[id];
}

vector<int> getAnswerVector(int id)
{
	//look in your vector of first names at index 'id' and return a vector of integers representing all the answers the student gave.
	
	return answers[id];
}

int getNumberOfFriends()
{
	//return the number of friends that were read in from the input file
	return first_name.size();
}

int compareAnswers(const vector<int>& answerVector1, const vector<int>& answerVector2)
{
	//loop over all the answers in the arrays (you can assume they are the same size) and return an integer rating how similar they were
	//NOTE:  You need to weight the answers based on the question that each person thought was most important.  You can find out what 
	//question that answerVector1 thought was most important with: answerVector1[NUMQUESTIONS-1].   You can find out what question that 
	//answerVector2 thought was most important with: answerVector2[NUMQUESTIONS-1].  You should weight these 2 questions twice as much as the
	//rest of the questions!  If both users pick the same question as most important, make that question worth 4 times the normal question!
	
	int score=0;

	for(int x=0; x<answerVector1.size()-1; x++)
	{
		if(answerVector1[x]==answerVector2[x])
			score++;
	}
	if(answerVector1[answerVector2[NUMQUESTIONS-1]]==answerVector2[answerVector2[NUMQUESTIONS-1]])
		score++;
	if(answerVector1[answerVector1[NUMQUESTIONS-1]]==answerVector2[answerVector1[NUMQUESTIONS-1]])
		score++;
	if(answerVector1[answerVector2[NUMQUESTIONS-1]]==answerVector2[answerVector2[NUMQUESTIONS-1]]&&answerVector2[NUMQUESTIONS-1]==answerVector1[NUMQUESTIONS-1])
		score++;


	return score;
}



//************************************************************************************************************************
//YOU DO NOT HAVE TO MODIFY THIS FUNCTION!  This function is using the most basic sorting algorithm "bubblesort."
//It is provided here for those that wish to examine it.  It will not need to be modified if you implement the
//compareAnswers, getNumberOfFriends, and getAnswerArray functions correctly."
void findTenBestMatches(const vector<int>& answerArray, vector<int>& returnArray)
{
	vector<int> sortArray(getNumberOfFriends());  //create a array of integers representing each index in your array of structures
	bool swapped;  //a boolean to indicate if any swaps have been made during this pass of the loop.

	for(int i=0; i<getNumberOfFriends(); i++)  //initialize the array so that we have an integer indicating the location in 
		sortArray[i] = i;			   //your structure array for every student that is read in.

	do{			//keep doing the following if we swap at least once during the pass
		swapped = false;	//set the swapped variable for this pass
		for(int i=0; i<getNumberOfFriends()-1; i++)		//we are going to look at each element in the array and see if it has a ranking lower
		{										//than the next element.  If so, the two need to be swapped.
			if(compareAnswers(answerArray, getAnswerVector(sortArray[i])) < compareAnswers(answerArray, getAnswerVector(sortArray[i+1])))
			{ //we compare the two rankings and swap the two in the array if the first is lower than the second  
			  //(we want the best rankings first)
				int temp;
				temp = sortArray[i];  //swap this one and the next one
				sortArray[i] = sortArray[i+1];
				sortArray[i+1] = temp;
				swapped = true; //if we moved anything, then another pass is necessary
			}	
		}
	}while(swapped);

	for(int i=0; i<10; i++)	//copy the top ten indexes to the returnArray
		if(i < getNumberOfFriends())	//if there are at least 10 students
			returnArray[i] = sortArray[i];	//copy the index
		else		//otherwise, put a -1 in that location
			returnArray[i] = -1;
}
