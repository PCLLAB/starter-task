# starter task

Create an simple experiment based on https://github.com/PCLLAB/LoP-Effect.

## Initialize experiment

Basically copy the files and structure from `LoP-Effect/E1`.

- `Materials` holds things like images and json files containing instructions and question/answers. We will only be using the `Practice.json` and pictures in the `Practice` folder for this experiment to keep it short.
- `css` holds css. Mostly unused, but impossible to delete.
- `js` holds js libraries. You may notice an ancient version of jquery and bootstrap 🤮.
- `plugins` contains jsPsych plugins
- `experiment.html` is where everything starts. It uses all the js and css files and starts the experiment.
- `experiment.js` is where the logic is defined. This is 99% of what you will need to edit.
- `jspsych.js` is the star of the show. Important to notice, this is jspsych v5.
- `lab-start.html` and `verify.html` are used to manually set experiment conditions/parameters. You start at `lab-start.html` which directs to `verify.html` which directs to `experiment.html` with the chosen URL parameters.

`experiment.js` is the basically the only file you will need to edit.

## Running an experiment locally

Serve it however you want, it's just a website. If you have `npm`, you can run the following commands.

```sh
npx http-server -c-1
# `-c-1` disables caching, see https://github.com/http-party/http-server
```

Access the website via the link in your terminal. You will need to go to `/experiment.html` to see the experiment, or `/lab-start.html` if the experiment requires URL parameters specifiying a condition.

`LoP-Effect` has a parameter called `Version` and you'll see in the url something like `...experiment.html?Version=1`. URL parameters like these can be accessed in `experiment.js` to choose how the experiment should work.

## Experiment details

You should have all the same files as `LoP-Effect/E1` in your folder. You can delete everything in your `experiment.js`. You will be building this from scratch to understand how it works.

Feel free to copy sections from the existing `experiment.js`, but many parts will change.
