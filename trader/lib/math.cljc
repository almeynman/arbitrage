(ns math)

(defn pow [a b] (reduce * 1 (repeat b a)))

(comment
  (pow 2 3)
  (pow 2 53)
  (pow 10 18))
