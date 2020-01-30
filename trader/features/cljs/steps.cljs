(ns steps
  (:require [cucumber :as cc]))

(cc/Given
  "an opportunity"
  (fn [num] (this-as world (swap! world assoc :num num))))
(cc/When
  "I increment the variable by {int}"
  (fn [num] (this-as world (swap! world assoc :num (+ (@world :num) num)))))
(cc/Then
  "the variable should contain {int}"
  (fn [num] (this-as world (assert (= (@world :num) num)))))

(comment
  (def world (atom {}))
  (swap! world assoc :num 1)
  (swap! world assoc :num (+ (@world :num) 1))
  ())
