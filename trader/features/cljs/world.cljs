(ns world
  (:require [cucumber :as cc]))

(cc/setWorldConstructor (fn [] (atom {})))
