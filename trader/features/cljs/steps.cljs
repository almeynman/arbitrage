(ns steps
  (:require [cucumber :as cc]))

(cc/Given
  "a variable set to {int}"
  (fn [num] (this-as world (.setTo world num))))
(cc/When
  "I increment the variable by {int}"
  (fn [num] (this-as world (.incrementBy world num))))
(cc/Then
  "the variable should contain {int}"
  (fn [num] (this-as world (assert (= (.-variable world) num)))))
