(ns world
  (:require [cucumber :as cc]))

(defn CustomWorld []
  (this-as this
    (set! (.-variable this) 0)))

(set! (.. CustomWorld -prototype -setTo)
      (fn [num]
        (this-as this
          (set! (.-variable this) num))))

(set! (.. CustomWorld -prototype -incrementBy)
      (fn [num]
        (this-as this
          (set! (.-variable this) (inc (.-variable this))))))

(cc/setWorldConstructor CustomWorld)
