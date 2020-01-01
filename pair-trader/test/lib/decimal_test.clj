(ns lib.decimal-test
  (:require [clojure.alpha.spec :as s]
            [clojure.test :as t]
            [lib.decimal :refer :all]))

(t/deftest test-decimal-in
  (t/testing "generative"
    (t/is (every? nil? (map :failure (stest/check `decimal-in))))))
