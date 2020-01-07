(ns world_example
  (:require [cucumber :as cc]))

(cc/setWorldConstructor (fn [] (atom {})))
