(ns lib.decimal
  (:require [decimal.core :as dc]))

(let [x (dc/decimal 123.4567)
      y (dc/decimal "123456.7e-3")
      z (dc/decimal x)]
  (dc/= x y z))
