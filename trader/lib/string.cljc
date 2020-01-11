(ns string
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]))

(defn non-blank? [s] (not (clojure.string/blank? s)))
(def gen-non-blank (gen/not-empty gen/string-alphanumeric))
(s/def ::non-blank
  (s/with-gen
    (s/and string? non-blank?)
    (fn [] gen-non-blank)))

(defn lower-case? [s] (= s (clojure.string/lower-case s)))
(def gen-lower-case
  (gen/fmap
    (fn [v] (->> (clojure.string/join v)
                 (clojure.string/lower-case)))
    (gen/vector gen/char-alphanumeric)))
(s/def ::lower-case (s/and ::non-blank-string lower-case?))

(def alpha-regex #"^[a-zA-Z]+$")
(defn alpha? [s] (re-matches alpha-regex s))
(def gen-alpha
  (gen/fmap
    (fn [v] (clojure.string/join v))
    (gen/vector gen/char-alpha)))
(s/def ::alpha
  (s/with-gen
    (s/and string? alpha?)
    (fn [] gen-alpha)))

(def gen-alpha-lower-case
  (gen/fmap
    (fn [v] (->> (clojure.string/join v)
                 (clojure.string/lower-case)))
    (gen/vector gen/char-alpha)))
(s/def ::lower-case-alpha
  (s/with-gen
    (s/and string? alpha? lower-case?)
    (fn [] gen-alpha-lower-case)))


(comment
  (gen/sample (s/gen (s/and ::lower-case-alpha)))
  (gen/sample (s/gen (s/and ::alpha ::lower-case)))
  (gen/sample (gen/vector gen/char-alpha))
  (gen/sample gen-lower-case)
  ())

