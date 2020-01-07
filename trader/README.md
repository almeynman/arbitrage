# Setup

## install node dependencies
```
$ yarn
```

## Setup a a new repl configuration
choose Clojure Repl -> Remote
Under connection type choose nREPL
Choose Connect to server with localhost:9000  

## Start nREPL
from your terminal run 
```
$ yarn nrepl
```
then start a repl that you configured
in the repl type the form below and click Enter 

```clojure
(shadow/repl :core)
``` 

Now you can evaluate the project in the repl

You might want to instrument your code to get https://clojure.org/guides/spec#_instrumentation

```clojure
(do
    (require '[cljs.spec.test.alpha :as stest])
    (stest/instrument))
```
