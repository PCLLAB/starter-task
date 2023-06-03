# Free-Recall-List
This is a very customizable plugin that allows the user to recall words into a list format. It has many features for data collection and for customizing how the user interacts with the plugin.

## Configuration Options
### Parameters
|Name|Type|Default Value|Description|Note|
|----|----|-------------|-----------|----|
|title|String||This title will appear above the plugin.||
|button_text|String|"Next"|Text that will appear in place of 'Next' on the button.|
|instructions|String|"Please enter as many words as you can remember."|The instructions to be shown in an optionally displayed instructions label||
|maximum_time|Number||Maximum number of milliseconds allowed for the user to continue.|If not used with `minimum_time`, then it will auto-advance and display the continue button.|
|minimum_time|Number||Minimum number of milliseconds allowed for the user to continue.|If set equal to `maximum_time` the continue button will be hidden and the experiment will advance automatically|
|allow_delete|Boolean|false|If set to true, the user can delete their responses from the answer box||
|show_progress|Boolean|false|If set to true and maximum time is set, it will show the progress bar||
|show_timer|Boolean|false|If set to true and maximum time is set, it will show a label with the time left||
|show_instructions|Boolean|false|If set to true the instruction label on top of the input box will be displayed||
|scroll_list|Boolean|false|If set to true, the list will have a scroll bar instead of getting taller as more words are added||
|word_list|Array||An optional array of strings of the correct words to be recalled||
|order_matters|Boolean|false|If set to true, order will matter when scoring correct responses||
|exact_response|Boolean|false|Responses must be exact, so no plurals, etc.||
|word_file|String||An optional path to a JSON file which contains the correct words.|Look below for an example of formatting.|


### Timing
This plugin has very customizable timing options.
 * Minimum time: by setting `minimum_time` you can enforce a minimum time limit before the user can submit
 * Maximum time: by setting `maximum_time` the test will end once the time limit has been reached
 * Set time: if you set `maximum_time` equal to `minimum_time`, the user cannot continue on their own and must remain in the trial for the specified amount of time.

### Interaction Options
You can customize the following:
* User word deletion: by setting `allow_delete` to true, the user can click on words in the word list and delete them. This is not enabled by default.

### Interface Options
* Progress Bar: set `show_progress` to true to display a progress bar. Will only show if `maximum_time` is set.
* Timer Label: set `show_timer` to true to display a label with time remaining. Will only show if `maximum_time` is set.
* Instructions Label: set `show_instructions` to true to display a label with the instructions string. Disabled by default.
* Scrolling vs. Expanding Word List: by default, the word list expands when more words are added than the default list height. Setting `scroll_list` to true will make the word bank scroll instead of expand.

### Scoring
This plugin will score a user entry 1 or 0 depending if the word was correct or not.
* The plugin scores based on the first three letters of the word, to account for different forms of words (ex: eye and eyes)
* The `exact_response` parameter, if set to true, will make sure the word is exactly as specified when being checked for correctness.

### Sample Configuration
```js
{
        type: 'pcllab-free-recall-list',
        instructions: "Enter some sweet words", //will only be shown if show_instructions is set to true
        maximum_time: 60000, //60 seconds to recall words
        minimum_time: 10000, //10 second minimum
        show_progress: true, //display a progress bar
        show_timer: true, //show a timer label
        show_instructions: true, //show the instructions label
        word_file: "example.json", //load the words from example.json
        scroll_list: true, //scroll list instead of getting taller with more words
        allow_delete: false,
        exact_response: true, //in this instance, the word must be exactly as is defined in the word list
}
```
### Example of `word_file` contents
```
[
    "trees",
    "word",
    "one",
    "two",
    "example"
]
```
### Output Data
The output varies based on which parameters are set. Here are all the possible output properties:
* `free_recall_time`: Total time elapsed in trial
* `responses`: The words the user has submitted
* `firstkeyRT`: The time the first key was pressed for each response in `responses`
* `submissionRT`: The time the enter key was pressed for each response in `responses`
* `correct`: If a list of correct words is provided, the user's correct responses will be listed here
* `trial_type`: Always set to `pcllab-free-recall-list`
* `trial_index`: Index of trial
* `time_elapsed`: The elapsed time of the trial
* `internal_node_id': Internal node ID

### Output Format
The output should work out of the box with MySQL databases and is also compatible with the default Mongo script on Jarvis. It should also easily translate into CSV format.

### Example Output
This output is from a recall without a set list of correct words and exact word matching disabled.
```
[
 {
  "free_recall_response": "tree",
  "firstkeyRT": 2327,
  "submissionRT": 3955,
  "correct": 1,
  "trial_type": "pcllab-free-recall-list",
  "trial_index": 0,
  "time_elapsed": 3956,
  "internal_node_id": "0.0-0.0"
 },
 {
  "free_recall_response": "word",
  "firstkeyRT": 5872,
  "submissionRT": 6345,
  "correct": 1,
  "trial_type": "pcllab-free-recall-list",
  "trial_index": 0,
  "time_elapsed": 6345,
  "internal_node_id": "0.0-0.0"
 },
 {
  "free_recall_response": "wrong",
  "firstkeyRT": 7137,
  "submissionRT": 7812,
  "correct": 0,
  "trial_type": "pcllab-free-recall-list",
  "trial_index": 0,
  "time_elapsed": 7812,
  "internal_node_id": "0.0-0.0"
 },
 {
  "free_recall_response": "memory",
  "firstkeyRT": 10508,
  "submissionRT": 11336,
  "correct": 0,
  "trial_type": "pcllab-free-recall-list",
  "trial_index": 0,
  "time_elapsed": 11336,
  "internal_node_id": "0.0-0.0"
 },
 {
  "free_recall_response": "example",
  "firstkeyRT": 12770,
  "submissionRT": 14522,
  "correct": 1,
  "trial_type": "pcllab-free-recall-list",
  "trial_index": 0,
  "time_elapsed": 14522,
  "internal_node_id": "0.0-0.0"
 },
 {
  "free_recall_time": 27075,
  "trial_type": "pcllab-free-recall-list",
  "trial_index": 0,
  "time_elapsed": 27076,
  "internal_node_id": "0.0-0.0"
 }
]
```
