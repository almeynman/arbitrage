(ns asset
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [string :as string]))

(def code-regex #"^[A-Z]{3,5}$")
(defn valid-code? [s] (re-matches code-regex s))
(def gen-code
  (gen/fmap
    (fn [v] (->> (clojure.string/join v)
                 (clojure.string/upper-case)))
    (gen/vector gen/char-alpha 3 5)))
(s/def ::code
  (s/with-gen
    (s/and string? valid-code?)
    (fn [] gen-code)))

(s/def ::name ::string/alpha)

(s/def ::precision (s/int-in 0 30))

(s/def ::asset
  (s/keys :req-un [::code ::precision]
          :opt-un [::name]))

(s/def ::base ::asset)
(s/def ::quote ::asset)

(comment
  (gen/sample (s/gen ::asset)))
