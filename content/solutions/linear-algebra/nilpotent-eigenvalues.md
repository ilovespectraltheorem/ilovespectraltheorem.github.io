+++
title = 'Eigenvalues of a nilpotent operator'
date = 2026-11-04
draft = false
source = 'Example exercise'
tags = ['eigenvalues']
+++
**Problem.** Let $V$ be a vector space and $T \colon V \to V$ linear with $T^k = 0$ for some $k \ge 1$. Show that every eigenvalue of $T$ is $0$.

{{< solution >}}
**Proof.** Suppose $Tv = \lambda v$ with $v \neq 0$. By induction, $T^k v = \lambda^k v$. But $T^k = 0$, so
$$
\lambda^k v = 0 .
$$
Since $v \neq 0$, we get $\lambda^k = 0$, hence $\lambda = 0$. $\blacksquare$
{{< /solution >}}
